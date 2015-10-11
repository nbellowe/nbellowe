---
layout: post
title: Designing a Language
---

#I would love to write a language for fun

Why? I wouldn't use it! I just want to see how it works start to finish.

The syntax is inspired by Typescript/EcmaScript7, Javascript, Java, C, Python

Its biggest feature would be to be highly modular, so in say, an enterprise environment, and thought is being put into the architecture of the code, even an entirely new control flow keyword other than for or while could be made, that compiles down to something that is say, recursive. Lets face it Javascript is strange, and people use it in strange ways. Its not always a bad thing though, sometimes doing things differently will legitimately save hours.

I want it to have a two step compilation process, write in the language and at compile time the compiler adds info to the original source code.

I think languages should have the ability to customize the compiler more... like new keywords ("GAME") ...

Examples:
    1. Blackjack
    2. Horse racing
    3. Soccer

#Blackjack
```java
enum Value { 2,3,4,5,6,7,8,9,10,Jack,Queen,King,Ace }

enum Suit { Spades,Hearts,Clubs,Diamonds }

type Card{
    constructable public num: Value;
    constructable public suit: Suit;
    toString() => Value[num] + " of " + Suit[suit]
}

type Player {
    cards: Card[0:2] = [] //0-2 elements
    give(c:Card) => cards.push(c)
    sum => cards[0]||0 + cards[1]||0 //its a "getter"
    wantsToHit => sum < 15 //its a "getter"
    toString() => sum + cards.toString(); //note the type difference
}

DEF VIEW { } //changes view based on model
DEF GAME { } //hook up game to view??
VIEW Scoreboard {}
VIEW Table {}

//I'd like this javascript to compile (javascript in brackets === function)
shuffle(a:T[]) => {c=a.length;while(c)b=Math.random()*(--c+1)|0,d=a[c],a[c]=a[b],a[b]=d;}

GAME BlackJack {
    players = [Player() for 0:NUMBERPLAYERS]
    dealer = Player()
    deck = shuffle([Card(num=x, suit=y) for x,y,n in 0:13,0:4,0:6])

    Gameplay = {
        for player in players+dealer+players+dealer
            player.give(deck.pop()) //deal

        for person in players
            while person.wantsToHit { //go around and hit
                if person.sum > 21 print "Bust!"
                else person.give(deck.pop())
            }

        while dealer.sum < 16 dealer.give(deck.pop())
        if dealer.sum > 21 print "Dealer busted!"

        for player in players
            if !player.folded and player.sum <= 21 and
            (dealer.sum > 21 or player.sum < dealer.sum)
                print "Win! " + player.toString()
    }
}
//{players+dealer+players+dealer}.give(deck.pop())
//while {players}.wantsToHit {
//    if that.sum > 21 print "Bust!"
//    that.give(deck.pop())
//}
//{print "Win! " + _.toString() for _ in players if _.sum > 21 and (_.sum < dealer.sum or dealer.sum > 21)}}
```
