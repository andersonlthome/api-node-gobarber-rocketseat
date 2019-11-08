import jwt from 'jsonwebtoken';
import { promisify } from 'util'; // pega função que pega uma função de callback e transforma em uma que pode usar async await

import authConfig from '../../config/auth';

// next usado para se der a requisição dentro da aplicação dev continuar ou não, se chamar o next a nossa rota que estiver utilizando esse middleware continuara chamando o controller, caso der um erro ou não chamar o next, não chamará o controller

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  const [, token] = authHeader.split(' '); // Bearer token

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
