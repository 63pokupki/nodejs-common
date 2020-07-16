import * as jwt from 'jsonwebtoken'
import { wait } from '../src/System/wait'

async function run (){
	const vJwt = jwt.sign({
		token:'9d50ed61df5951973b9e274f043b4ed7'
	}, 'f484b4d0b0b268295c6bdfdca7b7114bcpy5kf78rkcnui9oh', {
		algorithm: 'HS512',
		expiresIn: 60 * 60 * 24 * 30
	});

	console.log('jwt>>>', vJwt);

	const decoded:any = jwt.verify(vJwt, 'f484b4d0b0b268295c6bdfdca7b7114bcpy5kf78rkcnui9oh', { algorithms: ['HS512'] });

	await wait(2000);

	console.log('decoded>>>',decoded) // bar

	console.log(decoded.exp - decoded.iat, 60 * 60 * 24 * 7)
}
run();