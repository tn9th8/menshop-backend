import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser, User } from 'src/modules/users/schemas/user.scheme';
import { INIT_USERS } from './sample/users.sample';

@Injectable()
export class DatabasesService implements OnModuleInit {

    private readonly logger = new Logger(DatabasesService.name);

    constructor(
        private readonly configService: ConfigService,

        @InjectModel(User.name)
        private userModel: SoftDeleteModel<IUser>,
    ) { }

    async onModuleInit() {
        this.logger.log('>>> STARTING ON MODULE INIT...');
        const isInit = this.configService.get<boolean>('SHOULD_INIT');
        if (isInit) {
            const countUser = await this.userModel.count();

            // bulk create users
            if (countUser === 0) {
                this.logger.log('>>> THE USERS MODULE HAS INITIALIZED');
                const x = INIT_USERS;
                await this.userModel.insertMany(await INIT_USERS(this.configService))
            }

            if (countUser > 0) {
                this.logger.log('>>> THE SAMPLE DATA IS READY');
            }
        }
    }
}
