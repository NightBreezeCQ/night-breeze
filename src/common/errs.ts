import errcodes from "@/common/errcodes";
import { template } from "lodash";



interface ErrorParams {
    message: string;
    status: number;
}



export class HttpError extends Error {
    public readonly status: number;
    constructor(msg: string, code: string, status: number) {
        super(msg);
        this.name = code;
        this.status = status;
    }

    public toJSON() {
        return {
            code: this.name,
            message: this.message,
        };
    }
}

export class ErrorFactory {
    public readonly status: number;
    public readonly code: string;
    public readonly params: ErrorParams;
    constructor(code: string, params: ErrorParams) {
        this.code = code;
        this.status = params.status;
        this.params = params
    }

    public createMessage = (args: object) => {
        try {
            return template(this.params.message)(args);
        } catch (err) {
            return `cannot complete template<${this.params.message}> with args<${JSON.stringify(args)}>`;
        }
    };

    public toJson(args?: object) {
        return {
            code: this.code,
            message: this.createMessage(args),
        };
    }

    public toError(args?: object) {
        return new HttpError(this.createMessage(args), this.code, this.status);
    }
}

const errs = Object.keys(errcodes).reduce((acc, cur) => {
    acc[cur] = new ErrorFactory(cur, errcodes[cur]);
    return acc;
}, {}) as Errs<typeof errcodes>

errs.ErrMessage.toError({ extra: {} })

type Errs<A> = { [k in keyof A]: ErrorFactory };

export default errs