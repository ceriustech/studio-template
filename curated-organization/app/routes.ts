import {
	type RouteConfig,
	index,
	route,
	layout,
} from '@react-router/dev/routes';

// export default [index('routes/home.tsx')] satisfies RouteConfig;

import { PAGE_ROUTES_DATA } from './routes/constants';

const routes = Object.values(PAGE_ROUTES_DATA);

const ROUTES: RouteConfig = [...routes.map((r) => route(r.path, r.component))];

export default ROUTES;
