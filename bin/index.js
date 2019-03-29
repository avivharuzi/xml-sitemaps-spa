#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require('inquirer');

const XmlSitemapsSpa = require('./../lib/xml-sitemaps-spa');

clear();

console.log(
  chalk.yellow(
    figlet.textSync('XML Sitemaps SPA')
  )
);

inquirer.registerPrompt('datetime', require('inquirer-datepicker-prompt'));

(async () => {
  let answers = {};

  Object.assign(answers, await inquirer.prompt({
    type: 'input',
    name: 'url',
    message: 'Enter a website url',
    validate: (value) => {
      if (!value) {
        return 'This is a required field';
      }

      if (!/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(value)) {
        return 'Please enter a valid url';
      }

      return true;
    }
  }));

  Object.assign(answers, await inquirer.prompt({
    type: 'confirm',
    name: 'isLastModified',
    message: 'Are you want to set up a custom last modified? (The default taken from the server response)'
  }));

  if (answers.isLastModified) {
    Object.assign(answers, await inquirer.prompt({
      type: 'datetime',
      name: 'lastModified',
      message: 'Enter a last modified',
      format: ['mm', '/', 'dd', '/', 'yyyy', ' ', 'hh', ':', 'MM', ' ', 'TT']
    }));
  } else {
    answers.lastModified = false;
  }

  Object.assign(answers, await inquirer.prompt([
    {
      type: 'list',
      name: 'changeFrequency',
      message: 'Choose a change frequency',
      choices: [
        'none',
        'Always',
        'Hourly',
        'Daily',
        'Weekly',
        'Monthly',
        'Yearly'
      ],
      filter: (value) => {
        if (value === 'none') {
          return false;
        }

        return value.toLowerCase();
      }
    },
    {
      type: 'list',
      name: 'priority',
      message: 'Choose a priority',
      choices: [
        'none',
        '0.0',
        '0.1',
        '0.2',
        '0.3',
        '0.4',
        '0.5',
        '0.6',
        '0.7',
        '0.8',
        '0.9',
        '1.0'
      ],
      filter: (value) => {
        if (value === 'none') {
          return false;
        }

        return value;
      }
    },
    {
      type: 'number',
      name: 'limit',
      message: 'Enter a limit (for no limit "press enter")',
      validate: (value) => {
        if (isNaN(value) || value < 0) {
          return 'Please enter a valid number';
        }

        return true;
      },
      filter: (value) => {
        if (!value) {
          return 0;
        }

        return value;
      }
    },
    {
      type: 'input',
      name: 'exclude',
      message: 'Enter a exclude paths seprated with comma (can be a regex)',
      filter: (value) => {
        return value.split(',').map(val => val.trim());
      }
    },
    {
      type: 'input',
      name: 'output',
      message: 'Enter a output path for sitemap.xml file',
      validate: (value) => {
        if (!value) {
          return 'This is a required field';
        }

        return true;
      }
    }
  ]));

  const xmlSitemapsSpa = new XmlSitemapsSpa(answers.url, {
    lastModified: answers.lastModified,
    changeFrequency: answers.changeFrequency,
    priority: answers.priority,
    limit: answers.limit,
    exclude: answers.exclude,
    log: true,
    output: answers.output
  });

  await xmlSitemapsSpa.generate();

  process.exit()
})();
