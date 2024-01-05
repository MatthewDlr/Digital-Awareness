import { Injectable, isDevMode } from "@angular/core";

const GLOBAL_VOLUME = 0.75;

@Injectable({
  providedIn: "root",
})
export class SoundsEngineService {
  private supported = true;
  private audio = new Audio();
  private audioPath = "assets/sounds/";

  constructor() {
    if (!this.audio.canPlayType("audio/wav")) {
      this.supported = false;
    }
    this.audio.volume = GLOBAL_VOLUME;
    isDevMode() ? console.log("SoundsEngine Status: ", this.supported) : null;
  }

  private playAudio(audioName: string) {
    if (!this.supported) return;

    this.audio.src = this.audioPath + audioName + ".wav";
    this.audio.load();
    this.audio.play().catch(error => {
      isDevMode() ? console.error(error) : null;
    });
  }

  click() {
    this.playAudio("click");
  }

  success() {
    this.playAudio("success");
  }

  error() {
    this.playAudio("error");
  }

  switchON() {
    this.playAudio("switch-on");
  }

  switchOFF() {
    this.playAudio("switch-off");
  }

  erase() {
    this.playAudio("erase");
  }

  alert() {
    this.playAudio("alert");
  }

  notAllowed() {
    this.playAudio("not-allowed");
  }

  appear() {
    this.playAudio("appear");
  }

  select() {
    this.playAudio("select");
  }

  selectHard() {
    this.playAudio("select-hard");
  }
}
