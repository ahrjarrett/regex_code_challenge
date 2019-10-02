const R = require('ramda')

const url1 = 'https://www.louassist.com/companies/12345/employees'
const rule1 = 'https://www.louassist.com/companies/*/employees'

const url2 = 'https://www.louassist.com/companies/12345/employees/blah'
const rule2 = 'https://www.louassist.com/companies/*/employees/*'

// flips the order R.test takes its arguments
// flippedTest :: String -> RegExp → Boolean
const flippedTest = R.flip(R.test)
// see also: http://zvon.org/other/haskell/Outputprelude/flip_f.html


/////////
// 1.
/////////
// matchUrl :: String -> String -> Boolean
const matchUrl = R.curry((rule, url) => R.pipe(
		R.split('*'),
		R.join('(.+)'),
		R.constructN(1, RegExp),
		flippedTest(url),
	)(rule)
)

// Because matchUrl is curried, we can pass both arguments:
console.log(matchUrl(rule1, url1))
console.log(matchUrl(rule2, url2))

// Or we can pass them one at a time:
console.log(matchUrl(rule1)(url1))
console.log(matchUrl(rule2)(url2))


/////////
// 2.
// Pointfree implementation of matchUrl to be fancy (personally think it's cleaner,
// but can look weird so wouldn't use unless my team was familiar with pointfree pipelines:
/////////
// matchUrlPointfree :: URL -> Rule -> Boolean
const matchUrlPointfree = url => R.pipe(
		R.split('*'),
		R.join('(.+)'),
		R.constructN(1, RegExp),
		flippedTest(url),
	)

console.log(matchUrlPointfree(url1)(rule1))
console.log(matchUrlPointfree(url2)(rule2))


/////////
// 3.
// Since matchUrl returns a function waiting for a rule, we can build another
// function out of it that just waits for a rule to test the url against:
/////////
// matchUrlAgainstPreloadedRule :: URL -> Boolean
const matchUrlAgainstRule1 = matchUrl(rule1)
const matchUrlAgainstRule2 = matchUrl(rule2)

console.log(matchUrlAgainstRule1(url1))
console.log(matchUrlAgainstRule2(url2))


/////////
// 4.
// We can also use a placeholder for the rule argument, which returns a function that
// is waiting for matchUrl's first argument (a rule)
/////////
// testPreloadedUrlAgainstRule :: Rule -> Boolean
const testUrl1AgainstRule = matchUrl(R.__, url1)
const testUrl2AgainstRule = matchUrl(R.__, url2)

console.log(testUrl1AgainstRule(rule1))
console.log(testUrl2AgainstRule(rule2))


/////////
// 5.
// We can also just flip it, if we don't want to pass the R.__ argument (can get confusing):
/////////
// flippedMatchUrl :: URL -> Rule -> Boolean
const flippedMatchUrl = R.flip(matchUrl)

console.log(flippedMatchUrl(url1, rule1))
console.log(flippedMatchUrl(url2, rule2))

