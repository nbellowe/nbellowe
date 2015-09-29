---
layout: post
title: Designing a Language
---

#As an interesting problem, I tried to design a language concept I had...

Majorly stolen from Typescript/EcmaScript7, Javascript, Java, C, Python

Two step process, write in a language then at compile time the compiler adds info to the orignial source code.

I think languages should have the ability to customize the compiler more... like new keywords ("GAME") ...


Examples:
    1. Blackjack
    2. Horse racing
    3. Soccer

```java
enum Value { 2,3,4,5,6,7,8,9,10,Jack,Queen,King,Ace }

enum Suit { Spades,Hearts,Clubs,Diamonds }

type Card{
    constructable public n: Value;
    constructable public s: Suit;
    toString() => Value[n] + " of " + Suit[s]
}

type Player {
    cards: Card[0:2] = [] //0-2 elements
    sum = 0
    give(c:Card) => {
        cards.push(c)
        sum = cards[0]||0 + cards[1]||0;
    }
    wantsToHit => sum < 15 //its a "getter"
    toString() =>
        sum + cards.toString();
}

DEF VIEW { } //changes view based on model
DEF GAME { } //hook up game to view??
VIEW Scoreboard {}
VIEW Table {}

//I'd like this javascript to compile
shuffle(a:T[]) => {c=a.length;while(c)b=Math.random()*(--c+1)|0,d=a[c],a[c]=a[b],a[b]=d;}

GAME BlackJack {
    players = [Player() for 0:NUMBERPLAYERS]
    dealer = Player()
    deck = shuffle([Card(x,y) for x,y,n in 0:13,0:4,0:6])

    Gameplay = {
        for player in players+dealer+players+dealer
            player.give(deck.pop()) //deal

        for person in players
            while person.wantsToHit { //go around and hit
                if person.sum > 21 print "Bust!"
                person.give(deck.pop())
            }

        while dealer.sum < 16 dealer.give(deck.pop())
        if dealer.sum > 21 print "Dealer busted!"

        for player in players
            if !player.folded and player.sum <= 21 and
            (dealer.sum > 21 or player.sum < dealer.sum)
                print "Win! " + player.toString()
            //{players+dealer+players+dealer}.give(deck.pop())
            //while {players}.wantsToHit {
            //    if that.sum > 21 print "Bust!"
            //    that.give(deck.pop())
            //}
            //{print "Win! " + _.toString() for _ in players if _.sum > 21 and (_.sum < dealer.sum or dealer.sum > 21)}}
    }
}
```
