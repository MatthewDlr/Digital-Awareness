import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class Quotes {
  getRandomQuote() {
    return this.QUOTES_LIST[Math.floor(Math.random() * this.QUOTES_LIST.length)];
  }

  private QUOTES_LIST = [
    {
      text: '"The best preparation for tomorrow is doing your best today"',
      author: "H. Jackson Brown, Jr.",
    },
    {
      text: '"Process saves us from the poverty of our intentions"',
      author: "Elizabeth King",
    },
    {
      text: '"The secret of getting ahead is getting started"',
      author: "Mark Twain",
    },
    {
      text: '"Professionals stick to the schedule; amateurs let life get in the way"',
      author: "James Clear, Atomic Habits",
    },
    {
      text: "\"The secret to getting results that last is to never stop making improvements. It's remarkable what you can build if you just don't stop\"",
      author: "James Clear, Atomic Habits",
    },
    {
      text: '"The truth, is that many of the actions we take each day are shaped not by purposeful drive and choice but by the most obvious option"',
      author: "James Clear, Atomic Habits",
    },
    {
      text: '"The trick to doing anything is first cultivating a desire for it"',
      author: "James Clear, Atomic Habits",
    },
    {
      text: '"Incentives can start a habit. Identity sustains it"',
      author: "James Clear, Atomic Habits",
    },
    {
      text: '"What is immediately rewarded is repeated. What is immediately punished is avoided"',
      author: "James Clear, Atomic Habits",
    },
    {
      text: '"At some point, success in nearly every field requires you to ignore an immediate reward in favor of a delayed reward"',
      author: "James Clear, Atomic Habits",
    },
    {
      text: '"Desire is the difference between where you are now and where you want to be in the future"',
      author: "James Clear, Atomic Habits",
    },
    {
      text: '"Each action is a vote for the type of person you wish to become"',
      author: "James Clear, Atomic Habits",
    },
    {
      text: '"Time magnifies the margin between success and failure. It will multiply whatever you feed it. Good habits make time your ally. Bad habits make time your enemy"',
      author: "James Clear, Atomic Habits",
    },
    {
      text: '"With the same habits, you’ll end up with the same results. But with better habits, anything is possible"',
      author: "James Clear, Atomic Habits",
    },
    {
      text: '"The seed of every habit is a single, tiny decision"',
      author: "James Clear, Atomic Habits",
    },
    {
      text: '"Your identity emerges out of your habits"',
      author: "James Clear, Atomic Habits",
    },
    {
      text: '"Building habits in the present allows you to do more of what you want in the future""',
      author: "James Clear, Atomic Habits",
    },
    {
      text: '"Who you are is defined by what you’re willing to struggle for"',
      author: "Mark Manson, The Subtle Art of Not Giving a F*ck",
    },
    {
      text: '"Don’t just sit there. Do something. The answers will follow"',
      author: "Mark Manson, The Subtle Art of Not Giving a F*ck",
    },
    {
      text: '"True happiness occurs only when you find the problems you enjoy having and enjoy solving"',
      author: "Mark Manson, The Subtle Art of Not Giving a F*ck",
    },
    {
      text: '"We shape our tools and thereafter our tools shape us"',
      author: "Marshall McLuhan",
    },
    {
      text: '"Compare yourself to who you were yesterday, not to who someone else is today"',
      author: "Jordan Peterson, 12 Rules For Life",
    },
    {
      text: '"Always place your becoming above your current being"',
      author: "Jordan Peterson, 12 Rules For Life",
    },
    {
      text: '"It is my firm belief that the best way to fix the world—a handyman’s dream, if ever there was one, is to fix yourself"',
      author: "Jordan Peterson, 12 Rules For Life",
    },
    {
      text: '"Always place your becoming above your current being"',
      author: "Jordan Peterson, 12 Rules For Life",
    },
    {
      text: '"We cannot become what we want by remaining what we are"',
      author: "Max Depree",
    },
    {
      text: '"Attention without intention is wasted energy"',
      author: "Chris Bailey, Hyperfocus",
    },
    {
      text: '"We are what we pay attention to, and almost nothing influences our productivity and creativity as much as the information we\'ve consumed in the past"',
      author: "Chris Bailey, Hyperfocus",
    },
  ];
}
