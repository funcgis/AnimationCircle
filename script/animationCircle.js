/*
 * @Author: funcgis 
 * @Date: 2018-06-10 15:22:24 
 * @Last Modified by: chenlong
 * @Last Modified time: 2018-06-11 16:10:12
 * Three.js Animation Circle Plugin
 */

/**
 * Animation Circle Object
 * @param {*} scene Three.js scene Object 
 * @param {*} position Circle Animation's Position
 * @param {*} rotation Circle Animation's Rotation
 * @param {*} radius Circle's Radius
 * @param {*} segments Circle's segments
 * @param {*} color Circle's Color
 * @param {*} speed Circle Animation's Speed
 */
var AnimationCircle = function(scene, renderer, camera, position, rotation, radius, segments, color, speed){
    //properties
    this.scene = scene;
    this.renderer = renderer;
    this.camera = camera;
    this.radius = radius;
    this.segments = segments;
    this.color = color;
    this.speed = speed;
    this.position = position;
    this.rotation = rotation;

    this._ifAnimate = false;
    this._circleMain = null;
    this._circleRingOne = null;
    this._circleRingTwo = null;

    //init Circle Animation Objects
    this._init = function(){
        var circleBufferGeometry = new THREE.CircleBufferGeometry( this.radius, this.segments );
        var circleRingOneGeometry = new THREE.CircleBufferGeometry( 0.001, this.segments );
        var circleRingTwoGeometry = new THREE.CircleBufferGeometry( this.radius/2, this.segments );
        var materialMain = new THREE.MeshBasicMaterial( { color: color, opacity: 0.3, transparent: true, side: THREE.DoubleSide} );
        var materialRingOne = new THREE.MeshBasicMaterial( { color: color, opacity: 0, transparent: true, side: THREE.DoubleSide} );
        var materialRingTwo = new THREE.MeshBasicMaterial( { color: color, opacity: 0, transparent: true, side: THREE.DoubleSide} );
        materialMain.needsUpdate=true;
        materialRingOne.needsUpdate=true;
        materialRingTwo.needsUpdate=true;

        this._circleMain = new THREE.Mesh( circleBufferGeometry, materialMain );

        this._circleRingOne = new THREE.Mesh( circleRingOneGeometry, materialRingOne );
        this._circleRingOne.material.opacity = 0;

        this._circleRingTwo = new THREE.Mesh( circleRingTwoGeometry, materialRingTwo );
        this._circleRingTwo.material.opacity = 0;
        
        this._circleMain.position = this.position;
        this._circleRingOne.position = this.position;
        this._circleRingTwo.position = this.position;

        this.scene.add( this._circleMain );
        this.scene.add( this._circleRingOne );
        this.scene.add( this._circleRingTwo );
    };

    var that = this;
    //Circle Animation function
    this._animate = function(){
        requestAnimationFrame( that._animate );
        //do animate
        if(that._ifAnimate){
            if(that._circleRingOne.geometry.boundingSphere.radius<that.radius){
                var radiusOne = that._circleRingOne.geometry.boundingSphere.radius + speed;
                that._circleRingOne.geometry = new THREE.CircleBufferGeometry( radiusOne, that.segments );
                that._circleRingOne.material.opacity = 1-radiusOne/that.radius;
            }                
            else if(that._circleRingOne.geometry.boundingSphere.radius>=that.radius){
                that._circleRingOne.geometry = new THREE.CircleBufferGeometry( 0.01, that.segments );
                that._circleRingOne.material.opacity = 1;
            }
            if(that._circleRingTwo.geometry.boundingSphere.radius<that.radius){
                var radiusTwo = that._circleRingTwo.geometry.boundingSphere.radius + speed;
                that._circleRingTwo.geometry = new THREE.CircleBufferGeometry( radiusTwo, that.segments );
                that._circleRingTwo.material.opacity = 1-radiusTwo/that.radius;
            }
            else if(that._circleRingTwo.geometry.boundingSphere.radius>=that.radius){
                that._circleRingTwo.geometry = new THREE.CircleBufferGeometry( 0.01, that.segments );
                that._circleRingTwo.material.opacity = 1;
            }
        }
        renderer.render( that.scene, that.camera );
    };

    //init Circle Animation
    this._init();
}

/**
 * Begin Animation
 */
AnimationCircle.prototype.BeginAnimation = function(){
    this._animate();
    this._ifAnimate = true;
}

/**
 * Stop Animation
 */
AnimationCircle.prototype.StopAnimation = function(){
    this._ifAnimate = false;
    this._circleRingOne.material.opacity = 0;
    this._circleRingTwo.material.opacity = 0;
}

/**
 * Move Circle Position
 * @param {*} position 
 */
AnimationCircle.prototype.SetPosition = function(position){
    this._circleMain.position = position;
    this._circleRingOne.position = position;
    this._circleRingTwo.position = position;
}

/**
 * Rotation Circle
 * @param {*} rotation 
 */
AnimationCircle.prototype.SetRotation = function(rotation){
    this._circleMain.rotation = rotation;
    this._circleRingOne.rotation = rotation;
    this._circleRingTwo.rotation = rotation;
}

/**
 * Change Circle Radius
 * @param {*} radius 
 */
AnimationCircle.prototype.SetRadius = function(radius){
    this.radius = radius;
    this._circleMain.geometry = new THREE.CircleBufferGeometry( radius, this.segments );
}

/**
 * Change Cicle Segments
 * @param {*} segments 
 */
AnimationCircle.prototype.SetSegments = function(segments){
    this.segments = segments;
    this._circleMain.geometry = new THREE.CircleBufferGeometry( this.radius, segments );
}

/**
 * Change Circle Animation Speed
 * @param {*} speed 
 */
AnimationCircle.prototype.SetSpeed = function(speed){
    this.speed = speed;
}