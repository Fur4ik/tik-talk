class Activity{
  // coefficient;
  // name;
  constructor(name, coefficient){
    this.name = name;
    this.coefficient = coefficient;
  }
  calculateStrain(time, heartbeat){
    return heartbeat * this.coefficient / time
  }
}

class RunningActivity extends Activity{
  constructor() {
    super('running', 0.8);
  }
  // calculateStrain(time, heartbeat){
  //   this.strain = heartbeat * this.coefficient / time
  // }
}

class SwimmingActivity extends Activity{
  constructor() {
    super('swimming', 0.5)
  }
}

class WorkoutTracker{
  activity = []

  addActivity(activity, time, heartbeat){
    if(activity instanceof Activity){
      this.activity.push(activity);
    } else {
      throw new Error('Invalid activity type');
    }
  }
}


wt = new WorkoutTracker();

const running = new RunningActivity();
const swimming   = new SwimmingActivity();

wt.addActivity(running);
wt.addActivity(swimming);

const runningStrain = running.calculateStrain(100, 50)

console.log(wt.activity, runningStrain);
