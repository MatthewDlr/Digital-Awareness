import { Injectable, isDevMode } from "@angular/core";

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
}
