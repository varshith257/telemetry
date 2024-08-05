// Import Class Validator and ApiProperty
import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";

import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
} from 'class-validator';

/**
 * Custom Decorator To Check If Value Is A String Or An Array Of Strings
 */
export function IsStringOrStringArray(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isStringOrStringArray',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    if (typeof value === 'string') {
                        return true;
                    } else if (Array.isArray(value)) {
                        return value.every(item => typeof item === 'string');
                    }
                    return false;
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must be a string or an array of strings`;
                },
            },
        });
    };
}

export function IsValidDynamicFilters(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsValidDynamicFilters',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    if (Array.isArray(value)) {
                        return value.every((item: any) => {
                            return item.column && item.value && Operator.hasOwnProperty(item.operator); 
                        });
                    }
                    return false;
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must comply with DynamicFilter Interface`;
                },
            },
        });
    };
}


export enum Operator {
    eq = '=',
    neq = '!=',
    gt = '>',
    gte = '>=',
    lt = '<',
    lte = '<=',
    like = 'like',
}

export class DynamicFilter {
    column: string;
    value: string | number | boolean | Array<string | number | boolean>;
    operator: Operator;
}


export class GetMaterialViewRequestBody {
    @IsNumber()
    @ApiProperty({
        description: 'Page number to fetch data from',
        example: 1,
        default: 1
    })
    page: number = 1;

    @IsNumber()
    @ApiProperty({
        description: 'Number of records per page',
        example: 10,
        default: 10
    })
    per_page: number = 10;

    @ApiProperty({
        description: 'Bot ID to Fetch Records Of'
    })
    @IsStringOrStringArray({message : 'Bot ID Must Be A String Or An Array Of Strings'})
    bot_ids: string | string[] = 'asd';

    @ApiProperty({
        description: 'Column Name To Sort Data For',
        example: 'timestamp',
    })
    @IsOptional()
    sort_by: string = 'timestamp';

    @IsIn(['ASC', 'DESC'])
    @ApiProperty({
        description: 'Order to sort column provided in sortBy',
        example: 'ASC',
        default: 'DESC'
    })
    @IsOptional()
    sort: string = 'DESC';

    @ApiProperty({
        description: 'Dynamic Filters To Apply On Data',
        example: [
            {
                column: 'timestamp',
                value: '2021-01-01',
                operator: 'gte'
            }
        ]
    })
    @IsOptional()
    @IsValidDynamicFilters()
    dynamic_filters: DynamicFilter[] = [];

    @ApiProperty({
        description: 'Material View To Fetch Data From, Can Be Customized',
        example: {
            'timestamp': '2021-01-01'
        }
    })
    @IsOptional()
    @IsIn(['combined_data_v1']) // Forcing Check to only allow one value
    material_view: string = 'combined_data_v1'
}