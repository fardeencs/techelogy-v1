import {UserModel} from './user/user.model';

export class TokenModel {
    public sessionId: string;
    public firstName: string;
    public lastName: string;
    public userInfo: UserModel;
    public message: string;

    static toResponseModel(data: any, filters: any= []) {
        const model = new TokenModel();
        model.sessionId = data.sessionId;
        model.firstName = data.firstName;
        model.lastName = data.lastName;
        model.message = data.message;
        if (data.userInfo) {
          model.userInfo = data.userInfo;
        }
        return model;
    }
}
