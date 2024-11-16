import { Injectable } from '@nestjs/common';
import * as redis from 'redis';
import { IKey } from 'src/common/interfaces/index.interface';
import { InventoriesService } from 'src/modules/inventories/inventories.service';

@Injectable()
export class OrdersRedis {
    private redisClient: any;
    //todo: nghiên cứu cách viết callback
    // this.pExpire = promisify(this.redisClient.pExpire).bind(this.redisClient);
    // this.setNx = promisify(this.redisClient.setNx).bind(this.redisClient);
    // const delAsyncKey = promisify(this.redisClient.del).bind(this.redisClient);
    constructor(private readonly inventoriesService: InventoriesService) { }

    //tạo 1 cái Pessimistic Locking (Khóa Bi Quan)
    public acquireLock = async (productId: IKey, quantity: number, cartId: IKey) => {
        this.redisClient = redis.createClient({ url: 'redis://127.0.0.1:6379' });
        this.redisClient.on('error', (err: any) => console.log('Redis Client Error', err));
        await this.redisClient.connect();

        const key = `lock_v1_${productId}`;
        const retryTimes = 10;
        const expireTime = 6; //seconds
        const timeout = 50;//ms

        for (let i = 0; i < retryTimes; i++) {
            //tạo 1 key, thằng nào nắm giữ thì được vào thanh toán
            //NX: Not Exists: nếu key ko tồn tại, set NX sẽ hoạt động và chỉ có 1 lần, return OK
            //Nếu đã tồn tại, setNx sẽ ko làm gì và return null
            //=> atomic, tránh ghi đè, thay đổi data
            //=> 1 thao tác 1 lần 1 thời điểm, cơ chế khóa tạm thời. VD quá trình xử lý duy nhất, tránh vấn đề đồng thời
            const keyLock = await this.redisClient.set(key, 'value:locked-pessimistically', { NX: true });
            console.log(`lock: ${keyLock}. get: ${await this.redisClient.get(key)}`);
            //nếu product chưa bị chưa bị lock thì keyLock = OK, ngược lại thì result = null
            if (keyLock) {
                //thao tác với inventory
                const updated = await this.inventoriesService.reserveInventory(productId, quantity, cartId);
                if (updated.updatedCount == 1) {
                    return key; //todo
                }
                //Hết time thì giải phóng key (cơ chế TTL: time-to-live)
                const keyExpired = await this.redisClient.set(key, "", { EX: expireTime });
                console.log(`expire: ${keyExpired}. get: ${await this.redisClient.get(key)}`);
                return null;
            } else {
                //có một tiến trình khác đang xử lý sản phẩm này
                //hệ thống sẽ chờ 50ms rồi thử lại (retry) trong một số lần giới hạn (retryTimes)
                await new Promise((resolve) => setTimeout(resolve, timeout));
            }
        }
    }

    //giải phóng key
    public releaseLock = async (keyLock: any) => {
        const keyDeleted = await this.redisClient.del(keyLock);
        console.log(`delete: ${keyDeleted}. get: ${await this.redisClient.get(keyLock)}`);
        // await this.redisClient.quit();
        return keyDeleted;
    }
}

