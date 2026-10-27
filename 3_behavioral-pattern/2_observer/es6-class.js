// ES6: Class-based Observer (Publish-Subscribe) Pattern
// Ví dụ: Một Subject giám sát vị trí và bắn Ping cho Team (Observers)
class Observer {
  constructor(name) {
    this.namePick = name;
  }
  update(location) {
    this.goToHelp(location);
  }
  goToHelp(location) {
    console.log(`${this.namePick} ping ::${JSON.stringify(location)}`);
  }
}

class Subject {
  constructor() {
    this.observerList = [];
  }
  addObserver(observer) {
    this.observerList.push(observer);
  }
  notify(location) {
    this.observerList.forEach((observer) => observer.update(location));
  }
  removeObserver(observer) {
    this.observerList = this.observerList.filter((obs) => obs !== observer);
  }
}

const subject = new Subject();

// your pick
const riki = new Observer("Riki");
const sniper = new Observer("Sniper");

// add riki and sniper to team
subject.addObserver(riki);
subject.addObserver(sniper);

// push location to Team
subject.notify({ long: 123, lat: 106 });
