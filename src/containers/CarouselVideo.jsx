import React, { Component } from 'react';
import VideoPlayer from 'react-video-js-player';
 
function CarouselVideo(props){
    
    var player = {}
  
   function onPlayerReady(player){
        console.log("Player is ready: ", player);
        this.player = player;
    }
 
    function  onVideoPlay(duration){
        console.log("Video played at: ", duration);
    }
 
    function  onVideoPause(duration){
        console.log("Video paused at: ", duration);
    }
 
    function  onVideoTimeUpdate(duration){
        console.log("Time updated: ", duration);
    }
 
    function onVideoSeeking(duration){
        console.log("Video seeking: ", duration);
    }
 
    function   onVideoSeeked(from, to){
        console.log(`Video seeked from ${from} to ${to}`);
    }
 
    function  onVideoEnd(){
        console.log("Video ended");
    }
 
        console.log("players",props)
        return (
            <div>
                <VideoPlayer
                    controls={true}
                    src={props.source}
                    width="720"
                    height="420"
                    onReady={onPlayerReady.bind(this)}
                    onPlay={onVideoPlay.bind(this)}
                    onPause={onVideoPause.bind(this)}
                    onTimeUpdate={onVideoTimeUpdate.bind(this)}
                    onSeeking={onVideoSeeking.bind(this)}
                    onSeeked={onVideoSeeked.bind(this)}
                    onEnd={onVideoEnd.bind(this)}
                />
            </div>
        );
}
export default CarouselVideo;