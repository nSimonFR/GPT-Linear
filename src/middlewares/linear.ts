import { LinearClient } from "@linear/sdk";

const getBearer = (request: Request): null | string => {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || authHeader.substring(0, 6) !== 'Bearer') {
    return null;
  }
  return authHeader.substring(6).trim();
};

const authenticateLinear = (request: Request, env: any, context: any) => {
  const apiKey = getBearer(request);

  if (!apiKey) {
    return Response.json({
      success: false,
      errors: "Authentication error"
    }, {
      status: 401,
    });
  }

  env.linearClient = new LinearClient({ apiKey });
}

export default authenticateLinear;