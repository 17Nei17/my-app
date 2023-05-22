import React from "react";
import jsonshinda from "./shinda.json"
import jsonalecHolowka from "./alecHolowka.json"
import jsonEverlasting from "./everlasting.json"
// import skywalker_punch_sound_3Song from "./skywalker_punch_sound_3.mp3"
// import shindaSong from "./shinda.mp3"
// import everlasting_SummerSong from "./Sergey_Eybog_-_Everlasting_Summer.mp3"
// import alecHolowkaSong from "./audio.mp3"
// import catImg from "./KK.png"
// import IgorImg from "./kryska-igor.png"
// import ratImg from "./98Tz.webp"
// import LenaImg from "./kryska-lenka.png"
// import cheese from "./2079.webp"
import { Howl, Howler } from 'howler';



// const audioPunch = new Audio(skywalker_punch_sound_3Song);
// const shinda = new Audio(shindaSong);
// const everlasting_Summer = new Audio(everlasting_SummerSong);
// const alecHolowka = new Audio(alecHolowkaSong);




class BrickCatGame extends React.Component {
    constructor(props) {
        super(props);
        this.cat = document.querySelector(".catSit");
        this.lastKey = 0;
        this.state = {
            counter: 1200,
            health: 5,
            intervalId: null
        };
    }


    componentWillMount() {

        this.audioPunch = new Howl({
            src: [this.props.skywalker_punch_sound_3Song]
        });;
        document.addEventListener("keydown", this.onKeyPressed.bind(this));
        if (this.props.newState === "newGame-shinda") {
            this.start = new Date().getTime() - 1450; // аниме опенинг
            var sound = new Howl({
                src: [this.props.shindaSong]
            });
            this.json = jsonshinda;
        } else if (this.props.newState === 'newGame-everlasting') {
            this.start = new Date().getTime() - 1610; // бесконечное лето
            var sound = new Howl({
                src: [this.props.everlasting_SummerSong]
            });
            this.json = jsonEverlasting;

        } else {
            this.start = new Date().getTime() - 1300; // ночь в лесу
            var sound = new Howl({
                src: [this.props.alecHolowkaSong]
            });
            this.json = jsonalecHolowka;
        }
        this.audio = sound;
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.onKeyPressed.bind(this));
        clearInterval(this.state.intervalId);
    }

    shouldComponentUpdate() {
        return true;
    }

    componentDidUpdate() {
        this.end = new Date().getTime();
        if (this.maxValue + 5000 < this.state.counter) {
            this.stopAudioAndInterval();
            this.gameWin(this.isIgorAlive);
        }
        for (var key in this.json) {
            if (key == this.state.counter) {
                if (this.lastKey != key) {
                    this.createMouse(this.json[key], key);
                }
                this.lastKey = key;
            }
        }

        let catTop, cheeseTop, mouseTop;
        if (document.querySelector(".catSit") && document.querySelector(".cheese") && document.querySelector(".mouse")) {
            catTop = parseInt(window.getComputedStyle(document.querySelector(".catWrapper")).getPropertyValue("left"));
            cheeseTop = parseInt(window.getComputedStyle(document.querySelector(".cheese")).getPropertyValue("left"));
        }
        document.querySelectorAll(".mouse").forEach(element => {
            mouseTop = parseInt(window.getComputedStyle(element).getPropertyValue("left"));
            if ((mouseTop >= cheeseTop) && mouseTop && cheeseTop) {
                if (!element.classList.contains('dead')) {
                    if (element.classList.contains('igor')) {
                        this.isIgorAlive = true;
                    } else {
                        this.stopAudioAndInterval();
                        console.log("cheese")
                        this.gameOver();
                    }


                } else {
                    if (element.classList.contains('igor')) {
                        this.isIgorAlive = false;
                    }
                }
                element.remove();
            }
        });
    }

    createMouse(ratType, key) {
        let newMouse = document.createElement('img');
        if (ratType === "custom") {
            newMouse.src = this.props.ratImg;
            newMouse.className = "mouse";
        } else if (ratType === "igor") {
            newMouse.src = this.props.IgorImg;
            newMouse.className = "mouse igor";
        } else if (ratType === "ratWoman") {
            newMouse.src = this.props.LenaImg;
            newMouse.className = "mouse ratWoman";
        }
        newMouse.id = key;

        if (document.querySelector(".mouseWrapper")) {
            document.querySelector(".mouseWrapper").prepend(newMouse);
        }
    }

    componentDidMount() {
        const intervalId = setInterval(() => {
            this.setState(prevState => ({ counter: Math.round((this.end - this.start) * 0.1) * 10 }));
        }, 5);
        this.setState({ intervalId });
        this.isIgorAlive = true;
        this.cat = document.querySelector(".catSit");
        var json = this.json;
        this.audio.play();

        this.maxValue = Math.max(...Object.keys(json));
    }


    onKeyPressed(e) {
        if (document.querySelector(".catSit")) {
            document.querySelector(".catSit").classList.add("animate");
            this.animateCat();
            let catTop = parseInt(window.getComputedStyle(document.querySelector(".catWrapper")).getPropertyValue("left"));
            let mouseTop;
            let miss = true;
            let isKillMouse = false;
            document.querySelectorAll(".mouse").forEach(element => {
                mouseTop = parseInt(window.getComputedStyle(element).getPropertyValue("left"));
                if ((mouseTop >= catTop - 50 && mouseTop <= catTop + 30 && !isKillMouse)) {
                    isKillMouse = true;
                    element.classList.add("dead");
                    this.audioPunch.play();
                    miss = false;
                }
            })
            miss && this.reduceHealth();
        }
    }

    reduceHealth() {
        this.setState({ health: this.state.health - 1 }, function () {
            this.checkHealth()
        })
    }

    checkHealth() {
        console.log(this.state.health);
        if (this.state.health <= 0) {
            console.log("lowHP")
            this.stopAudioAndInterval();
            this.gameOver();
        }
    }

    stopAudioAndInterval() {
        Howler.unload();
    }

    animateCat() {
        var frame = 1;
        var el = document.querySelector(".catSit");

        setTimeout(function run() {
            el.classList.remove("frame0");
            el.classList.add("frame" + frame);
            frame++;
        }, 0);
        setTimeout(function run() {
            el.classList.remove("frame1");
            el.classList.add("frame" + frame);
            frame++;
        }, 40);
        setTimeout(function run() {
            el.classList.remove("frame2");
            el.classList.add("frame" + frame);
            frame++;
        }, 80);
        setTimeout(function run() {
            el.classList.remove("frame" + frame);
            el.classList.add("frame0");
        }, 160);
    }


    gameOver() {
        this.props.updateState("gameOver");
    }

    gameWin(isIgorAlive) {
        if (isIgorAlive) {
            this.props.updateState("gameWinIgorAlive");
        } else {
            this.props.updateState("gameWinIgorDead");
        }
    }

    render() {
        return (
            <div className={this.props.newState === 'newGame-everlasting' ? "gameField everlasting" : "gameField"}>
                <div>
                    <div className="catWrapper"><img src={this.props.catImg} className="catSit frame0"></img></div>
                    <img src={this.props.cheese} className="cheese"></img>
                </div>
                <div className="mouseWrapper">
                    {/* <img src={LenaImg} className="ratWoman mouse"></img> */}
                </div>
                <div className="health">у вас осталось {this.state.health} промаха</div>
                {this.props.newState === 'newGame-everlasting' ? <div className="info-text">Нужно чуть-чуть подождать</div> : ''}
                <p>Counter: {this.state.counter} ms</p>
            </div>
        );
    }

}

export default BrickCatGame;