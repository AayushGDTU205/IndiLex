class ErrorHandler extends Error{
    constructor(public statusCode:number,public status:boolean,public message:string="internal server issue"){
        super(message);
        this.message=message;
        this.statusCode=statusCode;
        this.status=false;
    }
}

export default ErrorHandler;
