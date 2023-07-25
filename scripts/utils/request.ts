interface RequestOption {
  body?: any;
  headers?: Record<string, any>;
  query?: Record<string, any>;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
}

const buildRequestUrl = (path: string, query?: Record<string, any>): string => {
  const q = buildURLQuery(query || {});
  path += `?${q}`
  return path;
};

const buildHeaders = (options: RequestOption): Record<string, any> => {
  let headers: Record<string, string> = {};

  if (options.body instanceof FormData) {
    headers['Accept'] = '*/*';
  } else {
    headers['Accept'] = 'application/json';
    headers['Content-Type'] = 'application/json';
  }

  if (options.headers) {
    for (const key in options.headers) {
      headers = {
        ...headers,
        ...options.headers
      };
    }
  }

  return headers;
};

const buildURLQuery = (queryObj: Record<string, any>): string => {
  const params = new URLSearchParams();
  for (const key in queryObj) {
    params.append(key, queryObj[key]);
  }
  return params.toString();
};

export const request = async (path: string, option: RequestOption): Promise<any> => {
  const url = buildRequestUrl(path, option.query);
  const headers = buildHeaders(option);
  const { method = 'GET', body } = option;

  let res = null;
	if (method === 'GET' || method === 'DELETE') {
		res = await fetch(url, {
			method,
			headers,
		});
	} else {
		res = await fetch(url, {
			method,
			headers,
			body: body instanceof FormData ? body : JSON.stringify(body), 
		});
	}
  if(res.status >= 400) {
    throw res
  }
  try {
    return await res.json();
  } catch (error) {
    return;
  }
};

export const requestWithMakaira = (path: string, option?: RequestOption): Promise<any> => {

  if(typeof window === undefined) {
    throw {error: 'Not in client side!'}
  }
  const params = new URLSearchParams(window.location.search);
  return request(path, {
    ...option,
    query: {
      ...option?.query,
      hmac: params.get('hmac'),
      nonce: params.get('nonce'),
      domain: params.get('domain'),
      instance: params.get('instance'),
      slug: params.get('slug'),
      appType: params.get('appType'),
    }
  })
}

export default request;
