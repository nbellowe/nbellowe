
function calc(numberOfPeople, searchAge, searchFor){
    var chanceGay = .2,
        chanceBiIfGay = .3,
        peopleInGender = numberOfPeople / 2,
        results = {
            maleLikeMales: peopleInGender * chanceGay,
            femaleLikeFemales: peopleInGender * chanceGay,
            malesLikeFemales: peopleInGender * (1-chanceGay*(1-chanceBiIfGay)),
            femalesLikeMales: peopleInGender * (1-chanceGay*(1-chanceBiIfGay))
        }
    console.log(`fwm -> ${results.femalesLikeMales}`)
    console.log(`mwf -> ${results.malesLikeFemales}`)
    console.log(`fwf -> ${results.femaleLikeFemales}`)
    console.log(`mwm -> ${results.maleLikeMales}`)
    console.log(`yours -> ${results[searchFor] / numberOfPeople}%`)
    console.log(`yours -> ${results[searchFor]} out of ${numberOfPeople} people`)
}

calc(1000, 20, 'femaleLikeFemales');
