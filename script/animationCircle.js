/*
 * @Author: funcgis 
 * @Date: 2018-06-10 15:22:24 
 * @Last Modified by: funcgis
 * @Last Modified time: 2018-06-12 15:20:03
 * Three.js Animation Circle Plugin
 */

/**
 * Animation Circle Object
 * @param {*} scene Three.js scene Object 
 * @param {*} renderer Three.js renderer object
 * @param {*} camera Three.js camera object
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
    //inner properties
    this._ifAnimate = false;
    this._ifAnimating = false;
    this._circleMain = null;
    this._circleRingOne = null;
    this._circleRingTwo = null;

    //init Circle Animation Objects
    this._init = function(){
        //create geometry and material
        var circleMainGeometry = new THREE.CircleBufferGeometry( this.radius, this.segments );
        var circleRingOneGeometry = new THREE.CircleBufferGeometry( 0.001, this.segments );
        var circleRingTwoGeometry = new THREE.CircleBufferGeometry( this.radius/2, this.segments );
        var materialMain = new THREE.MeshBasicMaterial({ 
            color: color, 
            opacity: 0.3, 
            transparent: true, 
            depthTest:false,
            side: THREE.DoubleSide
        });
        var materialRingOne = new THREE.MeshBasicMaterial({ 
            color: color, 
            opacity: 0, 
            transparent: true, 
            depthTest:false,
            side: THREE.DoubleSide
        });
        var materialRingTwo = new THREE.MeshBasicMaterial({ 
            color: color, 
            opacity: 0, 
            transparent: true, 
            depthTest:false,
            side: THREE.DoubleSide
        });
        //create main circle
        this._circleMain = new THREE.Mesh( circleMainGeometry, materialMain );
        //create RingOne circle
        this._circleRingOne = new THREE.Mesh( circleRingOneGeometry, materialRingOne );
        this._circleRingOne.material.opacity = 0;
        //create RingTwo circle
        this._circleRingTwo = new THREE.Mesh( circleRingTwoGeometry, materialRingTwo );
        this._circleRingTwo.material.opacity = 0;
        //create circle object
        this._circleMain.position.set(this.position.x,this.position.y,this.position.z);
        this._circleRingOne.position.set(this.position.x,this.position.y,this.position.z);
        this._circleRingTwo.position.set(this.position.x,this.position.y,this.position.z);
        //add circle to scene
        this.scene.add( this._circleMain );
        this.scene.add( this._circleRingOne );
        this.scene.add( this._circleRingTwo );
    };

    var that = this;
    //Circle Animation function
    this._animate = function(){
        requestAnimationFrame( that._animate );
        // stats.begin();
        //do animate
        if(that._ifAnimating){
            if(that._circleRingOne.geometry.boundingSphere.radius<that.radius){
                var radiusOne = that._circleRingOne.geometry.boundingSphere.radius + that.speed;
                that._circleRingOne.geometry.dispose ()
                that._circleRingOne.geometry = new THREE.CircleBufferGeometry( radiusOne, that.segments );
                that._circleRingOne.material.opacity = 1-radiusOne/that.radius;
            }                
            else if(that._circleRingOne.geometry.boundingSphere.radius>=that.radius){
                that._circleRingOne.geometry.dispose ()
                that._circleRingOne.geometry = new THREE.CircleBufferGeometry( 0.01, that.segments );
                that._circleRingOne.material.opacity = 1;
            }
            if(that._circleRingTwo.geometry.boundingSphere.radius<that.radius){
                var radiusTwo = that._circleRingTwo.geometry.boundingSphere.radius + that.speed;
                that._circleRingTwo.geometry.dispose ()
                that._circleRingTwo.geometry = new THREE.CircleBufferGeometry( radiusTwo, that.segments );
                that._circleRingTwo.material.opacity = 1-radiusTwo/that.radius;
            }
            else if(that._circleRingTwo.geometry.boundingSphere.radius>=that.radius){
                that._circleRingTwo.geometry.dispose ()
                that._circleRingTwo.geometry = new THREE.CircleBufferGeometry( 0.01, that.segments );
                that._circleRingTwo.material.opacity = 1;
            }
        }
        renderer.render( that.scene, that.camera );
        // stats.end();
    };

    //init Circle Animation
    this._init();
}

/**
 * Begin Animation
 */
AnimationCircle.prototype.BeginAnimation = function(){
    if(!this._ifAnimating){
        if(!this._ifAnimate){
            this._animate();
            this._ifAnimate = true;
        }
        this._ifAnimating = true;    
    }
}

/**
 * Stop Animation
 */
AnimationCircle.prototype.StopAnimation = function(){
    this._ifAnimating = false;
    this._circleRingOne.material.opacity = 0;
    this._circleRingTwo.material.opacity = 0;
}

/**
 * Move Circle Position
 * @param {*} position 
 */
AnimationCircle.prototype.SetPosition = function(position){
    this._circleMain.position.set(position.x,position.y,position.z);
    this._circleRingOne.position.set(position.x,position.y,position.z);
    this._circleRingTwo.position.set(position.x,position.y,position.z);
}

/**
 * Rotation Circle
 * @param {*} rotation 
 */
AnimationCircle.prototype.SetRotation = function(rotation){
    this._circleMain.rotation.set(rotation.x,rotation.y,rotation.z);
    this._circleRingOne.rotation.set(rotation.x,rotation.y,rotation.z);
    this._circleRingTwo.rotation.set(rotation.x,rotation.y,rotation.z);
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

/**
 * Change Circle Animation Color
 * @param {*} color 
 */
AnimationCircle.prototype.SetColor = function(color){
    this.color = color;
    this._circleMain.material.color = color;
    this._circleRingOne.material.color = color;
    this._circleRingTwo.material.color = color;
}

/**
 * remove from scene and dispose CircleAnimation Object 
 */
AnimationCircle.prototype.Dispose = function(){
    this.StopAnimation();
    cancelAnimationFrame(this._animate);
    this.scene.remove(this._circleMain);
    this.scene.remove(this._circleRingOne);
    this.scene.remove(this._circleRingTwo);
    this._circleMain.geometry.dispose();
    this._circleMain.material.dispose();
    this._circleMain = null;
    this._circleRingOne.geometry.dispose();
    this._circleRingOne.material.dispose();
    this._circleRingOne = null;
    this._circleRingTwo.geometry.dispose();
    this._circleRingTwo.material.dispose();
    this._circleRingTwo = null;
}
