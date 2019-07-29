import MainRequest from '../MainRequest';


export default function RequestSysMiddleware(request: MainRequest, response: any, next: any) {

    let errorSys = request.sys.errorSys;

    errorSys.declareEx({
        data:'Неправильный формат входных данных'
    });

    if (request.method == 'POST') {
        if (request.body['data']) {

            try{
                request.body['data'] = JSON.parse(request.body['data']);
            } catch (e){
                errorSys.errorEx(e, 'data', 'Неправильный формат входных данных');
                request.body['data'] = null;
            }
        }

    }

    next();
}
