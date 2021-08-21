import { parse, ParsedQuery, stringify, stringifyUrl } from "query-string";
import { isEmptyObj } from "../util/equals";
import { filterToUndefined, valueToUndefined } from "../util/filter";

export class StateLocation {
  pathname?: string;
  queries?: ParsedQuery;
  hash?: string;

  constructor(loc: {
    pathname?: string;
    queries?: ParsedQuery;
    hash?: string;
  }) {
    this.pathname = loc.pathname;
    this.queries = loc.queries;
    this.hash = loc.hash;
  }

  toUrl(): string {
    return stringifyUrl({
      url: this.pathname || "",
      query: this.queries || {},
      fragmentIdentifier: this.hash,
    });
  }

  equals(other: StateLocation): boolean {
    if (this.pathname === other.pathname && this.hash === other.hash) {
      if (this.queries === undefined || other.queries === undefined) {
        return this.queries === other.queries;
      }
      return stringify(this.queries) === stringify(other.queries);
    }
    return false;
  }

  replace(values: {
    pathname?: string | "";
    queries?: ParsedQuery | {};
    hash?: string | "";
  }): StateLocation {
    if (values.pathname !== undefined) {
      this.pathname = values.pathname === "" ? undefined : values.pathname;
    }
    if (values.queries !== undefined) {
      this.queries = isEmptyObj(values.queries) ? undefined : values.queries;
    }
    if (values.hash !== undefined) {
      this.hash = values.hash === "" ? undefined : values.hash;
    }
    return this;
  }

  addParams(params: ParsedQuery): StateLocation {
    if (this.queries === undefined) {
      this.queries = params;
    } else {
      this.queries = Object.fromEntries([
        ...Object.entries(this.queries),
        ...Object.entries(params),
      ]);
    }
    return this;
  }

  removeParams(...params: string[]): StateLocation {
    if (this.queries !== undefined) {
      this.queries = Object.fromEntries(
        Object.entries(this.queries).filter(
          (entry) => !params.includes(entry[0])
        )
      );
    }
    return this;
  }

  clone(): StateLocation {
    return new StateLocation({
      pathname: this.pathname,
      queries: this.queries,
      hash: this.hash,
    });
  }
}

function fromLocation(loc: Location): StateLocation {
  return new StateLocation({
    pathname: valueToUndefined(loc.pathname, "/", ""),
    queries: filterToUndefined(parse(loc.search), isEmptyObj),
    hash: valueToUndefined(loc.hash.replace("#", ""), ""),
  });
}

export const initialLocation = fromLocation(window.location);
