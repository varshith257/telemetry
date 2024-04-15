import { HTTPMethod } from "@fusionauth/typescript-client";
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Observable } from "rxjs";
import { SetMetadata } from '@nestjs/common';
import { Reflector } from "@nestjs/core";

export const NoAuth = () => SetMetadata('ignoreAuth', true);

export type UserData = {
    id: string;
    orgId: string;
    role: UserRole;
    verified: boolean;
}

export enum UserRole {
    OWNER = 'owner',
    ORG_ADMIN = 'orgAdmin',
    SUPER_ADMIN = 'superAdmin',
}

@Injectable()
export class AddUserDetails implements NestInterceptor {

    logger = new Logger(AddUserDetails.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly reflector: Reflector
    ) { }

    isAdminToken(authToken: string): boolean {
        const adminToken = this.configService.get<string>('ADMIN_TOKEN');
        return adminToken === authToken;
    }

    // TODO: Test whether users are verified.
    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
        const ignoreAuth: boolean = this.reflector.get(
            'ignoreAuth',
            context.getHandler(),
        );
        if (ignoreAuth) return next.handle();

        const req = context.switchToHttp().getRequest();
        const authToken = req.headers['authorization'];
        if (!authToken) {
            throw new UnauthorizedException();
        }
        let userData;
        if (this.isAdminToken(authToken)) {
            const reqData = (req.method === HTTPMethod.POST ? req.body.userData : req.query) ?? {};
            userData = {};
            userData.id = reqData.ownerId;
            userData.orgId = reqData.orgId;
            userData.role = UserRole.SUPER_ADMIN;
            userData.verified = true;
        }
        else {
            userData = await fetch(`${this.configService.get<string>('AUTH_SERVICE_URL')}/org/validate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authToken,
                },
            })
            .then((resp) => {
                if (!resp.ok) {
                    throw new UnauthorizedException();
                }
                else {
                    return resp.json();
                }
            })
            .then((resp) => {
                return resp.result;
            })
            .catch((err) => {
                console.log(err);
                throw new UnauthorizedException();
            });
            if (!userData) {
                throw new UnauthorizedException();
            }
        }
        req.body = req.body ?? {};
        req.body.userData = userData;
        return next.handle();
    }
}