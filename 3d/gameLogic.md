---
layout: page
title: Game Logic Language
permalink: gameLogic.html
---

#GLL (Game Logic Language)

Games are a common source of intrigue for programmers. Due to the very complex nature of the games, but the similarity in visualization and processing, I think higher level languages can be used to accurately depict a game. I have no idea yet, this is mostly just a place to brainstorm ...

So I'm going to steal some syntax from Javascript because it can be interpreted in lots of places.

Examples:
    1. Blackjack
    2. Horse racing
    3. Soccer

enum NumberState {
    2,3,4,5,6,7,8,9,10,
    Jack,Queen,King,Ace
}

enum SuitState{
    SPADE,
    HEART,
    CLUB,
    DIAMOND
}

enum Card{
    constructor(public n: NumberState,public s: SuitState);
}

interface IDeck<T> {
    get(): T
}

type Deck implements IDeck<Card> {
    cards = this.shuffleCards();
    shuffleCards() => this.cards = [Card(x,y) for x,y in range(0,13), range(0,4)]
    get() => this.cards.pop()
}

type 6Deck implements IDeck<Card> {
    shuffleCards() => this.cards = [Card(x,y) for x,y,n in range(0,13), range(0,4), range(0,6)]
    get() => this.cards.pop()
}


type Player {
    cards: Card[]
    give(c:Card) => this.cards.push(c)
sumCards()=>this.cards.reduce((a,b:Card)=>b.n+a)
    wantsToHit() => this.sumCards() < 15
}

VIEW Scoreboard {}

VIEW Table {}

GAME BlackJack {
    players: Player[N]
    dealer: Player
    deck: 6Deck
    all = players + dealer;

    Gameplay = {
        //deal
        foreach player in all+all
            player.give(deck.get())

        //go around and hit
        foreach person in players
            while person.wantsToHit():
                person.give(deck.get())
                if person.sumCards() > 21
                    print "Bust!"

        while dealer.sumCards() < 16
            dealer.give(deck.get())

        dc = dealer.sumCards()
        if dc > 21
            print "Dealer busted!"

        foreach player in players:
            pc = player.sumCards();
            if !player.folded
                and pc < 21
                and (dc > 21 or pc < dc)
                print "Win! ", player, pc;
    }
}
