'use strict'
const fs = require('fs')
const path = require('path')
const vorpal = require('vorpal')
const _ = require('lodash')
const cli = vorpal()
const { Config } = require('./Config')
let config = {}
let you = 0
let comp = 0

fs.readFile(path.resolve(__dirname, 'config.json'), (err, data) => {
  if (err) {
    console.log(err)
  } else {
    config = new Config(JSON.parse(data).rules)
  }
})

cli
 .command('loadConfig <filename>', 'Loads the configuration file for the game')
 .action(function (args, callback) {
   fs.readFile(path.resolve(__dirname, args.filename), (err, data) => {
     if (err) {
       this.log(err)
     } else {
       config = new Config(JSON.parse(data).rules)
       this.log('Configuration loaded successfully!!!')
       you = 0
       comp = 0
     }
     callback()
   })
 }
)
cli
  .command('play <yourMove>', 'Play the game with the specified move')
  .action(function (args, callback) {
    let rules = config.rules
    let compMove = _.sample(Object.keys(rules))
    if (_.indexOf(Object.keys(rules), args.yourMove, [0]) >= 0) {
      if (args.yourMove == compMove) {
        this.log('------It is a tie!------')
      } else if (_.indexOf(rules[compMove], args.yourMove, [0]) >= 0) {
        comp++
        this.log(`-----Computer Wins!-----`)
      } else {
        you++
        this.log(`-------You win!!!-------`)
      }
      this.log(`    You: ${you} | Comp: ${comp}`)
      this.log('------------------------')
      this.log(`Your choice:       ${args.yourMove}`)
      this.log(`Computer's choice: ${compMove}`)
      this.log('------------------------')
    } else {
      this.log(`${args.yourMove} is not a valid move use one of these: ${Object.keys(rules)}`)
    }
    callback()
  })

module.exports = {
  cli
}
