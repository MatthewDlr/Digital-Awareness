import { Injectable, isDevMode } from "@angular/core";
import { watchedWebsite } from "src/app/types";

const DEFAULT_TIMER_VALUE = isDevMode() ? 3 : 30; // In seconds. This is the default value for the timer when the user has to wait to access the website.
const MAX_TIMER_VALUE = 3; // In minutes. This specifies the maximum value the timer can be set to, regardless of user actions.
const INCREASE_COEF = 1; // The higher the value, the more aggressively the timer value increases.
const DECREASE_COEF = 1; // The higher the value, the more aggressively the timer value decreases.

@Injectable({
  providedIn: "root",
})
export class ScoringService {
  constructor() {}

  // Returns a score ranging from 0 to 100 aiming to assess the user's current habit concerning this website.
  // If there is not enough data to compute a reliable score, -1 is returned.
  computeWebsiteScore(website: watchedWebsite): number {
    const accuracy = website.timesBlocked + website.timesAllowed;
    if (accuracy < 5) return -1;

    const websiteScore = 210 * Math.log10((website.timesBlocked - website.timesAllowed) / accuracy + 2);
    const daysSinceLastAllowed = this.getDaysSinceLastAllowed(website);
    const lastAllowedScore = Math.log2(daysSinceLastAllowed * 4);

    const score = this.clamp(Math.round(websiteScore + lastAllowedScore), 0, 100);
    isDevMode() ? console.log("Website Score for " + website.host + " is " + score) : null;
    return score;
  }

  // Algorithm to compute the new timer value when the user goes back (success)
  computeNewDecreasedValue(website: watchedWebsite): number {
    const currentValue = website.timer;
    const score = this.computeWebsiteScore(website);
    const daysSinceLastAllowed = this.getDaysSinceLastAllowed(website);
    let newValue = currentValue;

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

    isDevMode()
      ? alert("The timer value decreased from " + currentValue + "s to " + newValue + "s" + " (score: " + score + ")")
      : null;
    return newValue;
  }

  computeNewIncreasedValue(website: watchedWebsite): number {
    const currentValue = website.timer;
    const score = this.computeWebsiteScore(website);
    let newValue = currentValue;

    const daysSinceLastAllowed = this.getDaysSinceLastAllowed(website);
    if (daysSinceLastAllowed >= 6) return currentValue; // If the user has not allowed the website for 6 days or more, we do not increase the timer value because it's likely that he has good habits.

    // The lower the score, the more aggressive the increase function becomes.
    if (score == -1 || (score >= 30 && score <= 70)) {
      newValue += (newValue / 8) ** 1.75 * INCREASE_COEF; // Default increase function.
    } else if (score < 30 && score > 15) {
      newValue += (newValue / 10) ** 2.25 * INCREASE_COEF;
    } else if (score <= 15) {
      newValue += (newValue / 10) ** 2.5 * INCREASE_COEF;
    } else if (score > 70 && score < 90) {
      newValue += (newValue / 10) ** 1.4 * INCREASE_COEF;
    }
    newValue = Math.round(this.clamp(newValue, 30, MAX_TIMER_VALUE * 60));
    isDevMode()
      ? alert("The timer value increased from " + currentValue + "s to " + newValue + "s" + " (score: " + score + ")")
      : null;

    return newValue;
  }

  // This function adjust the timer value as an incentive to nudge the user in the good direction.
  nudgeTimerValue(website: watchedWebsite): number {
    let timerValue = website.timer;
    const score = this.computeWebsiteScore(website);

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

    // We adjust the timer value based on the last time the user allowed access to the website.
    // If he allowed access 1 day ago, then the timer remains unchanged; however, if the last allowance was 7 days ago, the value is divided by 1.49
    const daysSinceLastAllowed = this.getDaysSinceLastAllowed(website);
    const dayCoef = daysSinceLastAllowed ** 2 / 100 + 1;
    timerValue /= dayCoef;

    return Math.round(timerValue);
  }

  private clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  private getDaysSinceLastAllowed(website: watchedWebsite): number {
    if (!website.allowedUntil) return 1;
    return this.clamp((Date.now() - new Date(website.allowedUntil).getTime()) / (1000 * 60 * 60 * 24), 1, 7);
  }
}
