import 'reflect-metadata';
import {
  Injector, Inject, Injectable, provide
} from 'angular2/core';

class Http {}

class DummyService {}

@Injectable()
class UserService {
  constructor(public http: Http) {}
}

// let injector = Injector.resolveAndCreate([
//   DummyService,
//   provide(Http, { useExisting: DummyService }),
//   UserService
// ]);

// let us:UserService = injector.get(UserService);

// console.log(us.http instanceof DummyService);
let dummyHttp = {
  get() {},
  post() {}
};

let injector = Injector.resolveAndCreate([
  provide(DummyService, { useValue: dummyHttp }),
  provide(Http, { useExisting: DummyService }),
  UserService
]);

console.assert(injector.get(UserService).http === dummyHttp);
