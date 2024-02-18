import { Injectable, isDevMode } from "@angular/core";
import { watchedWebsite } from "src/app/types/types";

const DEFAULT_TIMER_VALUE = isDevMode() ? 3 : 30; // In seconds. This is the default value for the timer when the user has to wait to access the website.
const MAX_TIMER_VALUE = 3; // In minutes. This specifies the maximum value the timer can be set to, regardless of user actions.
const INCREASE_COEF = 1; // The higher the value, the more aggressively the timer value increases.
const DECREASE_COEF = 1; // The higher the value, the more aggressively the timer value decreases.

@Injectable({
  providedIn: "root",
})
export class ScoringService {
  private currentWebsite!: string;
  private currentScore!: number;

  getScoreOf(website: watchedWebsite): number {
    if (website.host == this.currentWebsite && this.currentScore) {
      isDevMode() ? console.log("Score has been fetched directly from the service") : null;
      return this.currentScore;
    }

    this.currentScore = this.computeWebsiteScore(website);
    this.currentWebsite = website.host;
    return this.currentScore;
  }

  // Returns a score ranging from 0 to 100 aiming to assess the user's current habit concerning this website.
  // If there is not enough data to compute a reliable score, -1 is returned.
  private computeWebsiteScore(website: watchedWebsite): number {
    const accuracy = website.timesBlocked + website.timesAllowed;
    if (accuracy < 5) return -1;

    const ratio = website.timesBlocked / Math.max(website.timesAllowed, 1);
    let score = 60 + (Math.log(ratio) / Math.log(2)) * 20;
    score = Math.round(this.clamp(score, 0, 100));

    isDevMode() ? console.log("Website Score for " + website.host + " is " + score) : null;
    return score;
  }

  // Algorithm to compute the new timer value when the user goes back (success)
  computeNewDecreasedTimer(website: watchedWebsite): number {
    const currentTimer = website.timer;
    const score = this.getScoreOf(website);
    const daysSinceLastAllowed = this.getDaysSinceLastAllowed(website);
    let newValue = currentTimer;

    if (daysSinceLastAllowed >= 6) return DEFAULT_TIMER_VALUE; // If last access was 6 days ago or more, then it's likely that the user has good habits, so we set the timer to the default value.

    if (score == -1) {
      newValue = Math.max((newValue /= 1.175 * DECREASE_COEF), 30); // Default decrease function.
    } else {
      const coef = Math.max(Math.log10(score) - 0.5 / DECREASE_COEF, 0); // Return a value between 0 and 1.5 based on the score.
      const adjust = daysSinceLastAllowed / 10 - 0.1; // Return a value between 0 and 0.4 based on the last time the user allowed the website.
      newValue = Math.round(newValue / (coef + adjust));
      newValue = this.clamp(newValue, 30, MAX_TIMER_VALUE * 60);
    }
    newValue = Math.round(newValue);

    isDevMode() && alert("The timer value decreased from " + currentTimer + "s to " + newValue + "s" + " (score: " + score + ")");
    return newValue;
  }

  computeNewIncreasedTimer(website: watchedWebsite): number {
    const currentTimer = website.timer;
    const score = this.getScoreOf(website);
    let newValue = currentTimer;

    const daysSinceLastAllowed = this.getDaysSinceLastAllowed(website);
    if (daysSinceLastAllowed >= 6) return currentTimer; // If the user has not allowed the website for 6 days or more, we do not increase the timer value because it's likely that he has good habits.

    // The lower the score, the more aggressive the increase function becomes.
    if (score == -1 || (score >= 30 && score <= 70)) {
      newValue += (newValue / 8) ** 1.75 * INCREASE_COEF; // Default increase function.
    } else if (score < 30 && score > 15) {
      newValue += (newValue / 10) ** 2.25 * INCREASE_COEF;
    } else if (score <= 15) {
      newValue += (newValue / 10) ** 2.5 * INCREASE_COEF;
    } else if (score > 70 && score < 85) {
      newValue += (newValue / 10) ** 1.4 * INCREASE_COEF;
    } else if (score >= 85) {
      newValue = currentTimer;
    }
    newValue = Math.round(this.clamp(newValue, 30, MAX_TIMER_VALUE * 60));

    isDevMode() && alert("The timer value increased from " + currentTimer + "s to " + newValue + "s" + " (score: " + score + ")");
    return newValue;
  }

  // This function adjust the timer value as an incentive to nudge the user in the good direction.
  nudgeTimerValue(website: watchedWebsite): number {
    let timerValue = website.timer;
    const score = this.getScoreOf(website);

    if (score == -1) return timerValue; // The timer value remains unchanged if the user has not interacted with the website sufficiently.

    // If the user has a low score, we increase the timer value as a nudge to encourage the user to go back.
    if (score < 10) {
      timerValue *= 1.75 * INCREASE_COEF;
    } else if (score < 20) {
      timerValue *= 1.5 * INCREASE_COEF;
    } else if (score < 30) {
      timerValue *= 1.25 * INCREASE_COEF;
    }

    // If the user has a high score, we slightly reduce the timer value to indicate that accessing the website is OK.
    else if (score > 90) {
      timerValue /= 1.25;
    } else if (score > 80) {
      timerValue /= 1.1;
    }

    // We adjust the timer value based on the last time the user accessed to the website.
    // If he accessed 1 day ago, then the timer remains unchanged; however, if the last allowance was 7 days ago, the value is divided by 1.49
    const daysSinceLastAllowed = this.getDaysSinceLastAllowed(website);
    const dayCoef = daysSinceLastAllowed ** 2 / 100 + 1;
    timerValue /= dayCoef;

    return Math.round(timerValue);
  }

  // Return a number between 1 and 0.15 that take in consideration the days since the website has not been opened
  getAllowedCoef(website: watchedWebsite): number {
    const daysSinceLastAllowed = this.getDaysSinceLastAllowed(website);
    const coef = 1 - Math.log10(daysSinceLastAllowed);
    isDevMode() ? alert("AllowedCoef is: " + coef) : null;

    return coef;
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  private getDaysSinceLastAllowed(website: watchedWebsite): number {
    if (!website.allowedUntil) return 1;
    const daysDifference = (Date.now() - new Date(website.allowedUntil).getTime()) / (1000 * 60 * 60 * 24);
    return this.clamp(daysDifference, 1, 7);
  }
}
