import { HTTPMethod } from "@fusionauth/typescript-client";
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Observable } from "rxjs";
import { SetMetadata } from '@nestjs/common';
import { Reflector } from "@nestjs/core";

export const NoAuth = () => SetMetadata('ignoreAuth', true);

export type UserData = {
    orgId: string;
    botId: string;
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
        const botId = req.headers['botid'];
        const orgId = req.headers['orgid'];
        if (!botId || !orgId) {
            throw new UnauthorizedException();
        }

        let userData;
        userData = {};
        userData.botId = botId;
        userData.orgId = orgId;
        userData.role = UserRole.SUPER_ADMIN;
        userData.verified = true;        
        req.body.userData = userData;
        return next.handle();
    }
}