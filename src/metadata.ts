/* eslint-disable */
export default async () => {
    const t = {
        ["./common/enums/gender.enum"]: await import("./common/enums/gender.enum"),
        ["./auth/dto/auth-user.dto"]: await import("./auth/dto/auth-user.dto")
    };
    return { "@nestjs/swagger": { "models": [[import("./modules/users/dto/create-user.dto"), { "CreateUserDto": { name: { required: true, type: () => String }, phone: { required: true, type: () => String }, email: { required: true, type: () => String }, password: { required: true, type: () => String }, age: { required: true, type: () => Number }, gender: { required: true, enum: t["./common/enums/gender.enum"].Gender }, address: { required: true, type: () => String }, avatar: { required: true, type: () => String } } }], [import("./modules/users/dto/update-user.dto"), { "UpdateUserDto": { id: { required: true, type: () => String } } }], [import("./auth/dto/sign-in.dto"), { "SignInDto": { username: { required: true, type: () => String } } }], [import("./auth/dto/sign-up.dto"), { "SignUpDto": { verifyToken: { required: true, type: () => String }, verifyExpires: { required: true, type: () => Date } } }], [import("./auth/dto/auth-user.dto"), { "AuthUserDto": { id: { required: true, type: () => require("mongoose").Types.ObjectId } } }], [import("./modules/products/dto/create-product.dto"), { "CreateProductDto": {} }], [import("./modules/products/dto/update-product.dto"), { "UpdateProductDto": {} }], [import("./modules/products/entities/product.entity"), { "Product": {} }]], "controllers": [[import("./app.controller"), { "AppController": { "getHello": { type: String } } }], [import("./modules/users/users.controller"), { "UsersController": { "create": { type: Object }, "findAll": { type: [Object] }, "findOne": { type: Object }, "update": { type: Object }, "remove": { type: Object } } }], [import("./auth/auth.controller"), { "AuthController": { "signIn": {}, "signOut": { type: Object }, "refreshAccount": {}, "getAccount": { type: t["./auth/dto/auth-user.dto"].AuthUserDto }, "signUp": { type: String }, "verifyEmail": { type: Boolean } } }], [import("./modules/products/products.controller"), { "ProductsController": { "create": { type: String }, "findAll": { type: String }, "findOne": { type: String }, "update": { type: String }, "remove": { type: String } } }]] } };
};