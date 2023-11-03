import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Quotes {
  private QUOTES_LIST = [
    {
      text: '"The best preparation for tomorrow is doing your best today"',
      author: 'H. Jackson Brown, Jr.',
    },
    {
      text: '"Process saves us from the poverty of our intentions"',
      author: 'Elizabeth King',
    },
    {
      text: '"The secret of getting ahead is getting started"',
      author: 'Mark Twain',
    },
    {
      text: '"Professionals stick to the schedule; amateurs let life get in the way."',
      author: 'James Clear, Atomic Habits',
    },
    {
      text: '"The truth, is that many of the actions we take each day are shaped not by purposeful drive and choice but by the most obvious option."',
      author: 'James Clear, Atomic Habits',
    },
    {
      text: '"The trick to doing anything is first cultivating a desire for it."',
      author: 'James Clear, Atomic Habits',
    },
    {
      text: '"Incentives can start a habit. Identity sustains it."',
      author: 'James Clear, Atomic Habits',
    },
    {
      text: '"What is immediately rewarded is repeated. What is immediately punished is avoided."',
      author: 'James Clear, Atomic Habits',
    },
    {
      text: '"At some point, success in nearly every field requires you to ignore an immediate reward in favor of a delayed reward."',
      author: 'James Clear, Atomic Habits',
    },
    {
      text: '"Desire is the difference between where you are now and where you want to be in the future."',
      author: 'James Clear, Atomic Habits',
    },
    {
      text: '"Each action is a vote for the type of person you wish to become."',
      author: 'James Clear, Atomic Habits',
    },
    {
      text: '"Time magnifies the margin between success and failure. It will multiply whatever you feed it. Good habits make time your ally. Bad habits make time your enemy."',
      author: 'James Clear, Atomic Habits',
    },
    {
      text: '"Who you are is defined by what you’re willing to struggle for."',
      author: 'Mark Manson, The Subtle Art of Not Giving a F*ck',
    },
    {
      text: '"Don’t just sit there. Do something. The answers will follow."',
      author: 'Mark Manson, The Subtle Art of Not Giving a F*ck',
    },
    {
      text: '" True happiness occurs only when you find the problems you enjoy having and enjoy solving."',
      author: 'Mark Manson, The Subtle Art of Not Giving a F*ck',
    },
    {
      text: '"We shape our tools and thereafter our tools shape us"',
      author: 'Marshall McLuhan',
    },
    {
      text: 'Do you you really need to do this?',
      author: '',
    },
    {
      text: 'Is this really the best use of your time?',
      author: '',
    },
    {
      text: 'If you have no meaningful reason to go there, then walk away.',
      author: '',
    },
    {
      text: 'Screen off, enjoy life.',
      author: '',
    },
    {
      text: 'Wondering, is this all?',
      author: '',
    },
  ];

  getRandomQuote() {
    return this.QUOTES_LIST[
      Math.floor(Math.random() * this.QUOTES_LIST.length)
    ];
  }
}
