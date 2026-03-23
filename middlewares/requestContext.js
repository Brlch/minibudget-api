let nextRequestId = 1;

export default function requestContext(req, res, next) {
  const requestId = `req-${nextRequestId++}`;
  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
}
