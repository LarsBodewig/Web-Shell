import { parse, ParsedQuery, stringify, stringifyUrl } from "query-string";
import { isEmptyObj } from "../util/equals";
import { valueToUndefined, filterToUndefined } from "../util/filter";

export type StateLocation = {
  pathname?: string;
  queries?: ParsedQuery;
  hash?: string;
};

function fromLocation(loc: Location): StateLocation {
  return {
    pathname: valueToUndefined(loc.pathname, "/", ""),
    queries: filterToUndefined(parse(loc.search), isEmptyObj),
    hash: valueToUndefined(loc.hash.replace("#", ""), ""),
  };
}

export const initialLocation = fromLocation(window.location);

export function locToUrl(loc: StateLocation): string {
  return stringifyUrl({
    url: loc.pathname || "",
    query: loc.queries || {},
    fragmentIdentifier: loc.hash,
  });
}

export function locEquals(left: StateLocation, right: StateLocation): boolean {
  if (left.pathname === right.pathname && left.hash === right.hash) {
    if (left.queries === undefined || right.queries === undefined) {
      return left.queries === right.queries;
    }
    return stringify(left.queries) === stringify(right.queries);
  }
  return false;
}
