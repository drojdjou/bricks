/* 

Trackball controls for Three.js

Usage: 


var trackball = new Trackball();

// then, inside render function
var quaternion = trackball.rotation;
// ...and apply to an object

*/
var Trackball = function() {

    var that = this;

    this.rotation = new THREE.Quaternion();

    /**
     * Based on http://www.math.tamu.edu/~romwell/arcball_js/arcball.pde
     *
     * @param mx mouse X position in range [ -1 , 1 ]
     * @param my mouse Y position in range [ -1 , 1 ]
     * @param radius of the arc ball for interaction. Default value: 0.5
     */
    var mouseToUnitSphereVector = function(mx, my, gr, v) {
        gr = gr || 0.5;
        v = v || new THREE.Vector3();

        var px = mx / gr;
        var py = my / gr;
        var rl = px * px + py * py;

        if (rl >= 1) {
            v.set(px, py, 0);
        } else {
            v.set(px, py, Math.sqrt(1 - rl));
        }

        v.normalize();

        return v;
    }

        var mx = 0, my = 0, isDown = false;
        var lastMV = new THREE.Vector3(), currMV = new THREE.Vector3(), deltaR = new THREE.Quaternion();
        var aspect = window.innerWidth / window.innerHeight;

        var normalizeMouseCoords = function(e) {
            e = ('ontouchstart' in window) ? e.targetTouches[0] : e;
            mx = (e.pageX / window.innerWidth * 2 - 1) * aspect;
            my = (e.pageY / window.innerHeight * 2 - 1) * -1;
        }

        var onInteractionStart = function(e) {
            isDown = true;
            normalizeMouseCoords(e);
            mouseToUnitSphereVector(mx, my, 1, lastMV);
        }

        var onInteractionMove = function(e) {
            if (isDown) {
                normalizeMouseCoords(e);
                mouseToUnitSphereVector(mx, my, 1, currMV);
                var a = Math.min(1, lastMV.dot(currMV));
                lastMV.cross(currMV);
                deltaR.set(lastMV.x, lastMV.y, lastMV.z, a);
                that.rotation.multiplyQuaternions(deltaR, that.rotation);
                lastMV.copy(currMV);
            }
        }

        var onInteractionEnd = function() {
            isDown = false;
        }

        if('ontouchstart' in document) {
            document.addEventListener('touchstart', onInteractionStart, false);
            document.addEventListener('touchmove', onInteractionMove, false);
            document.addEventListener('touchend', onInteractionEnd, false);
        } else {
            document.addEventListener('mousedown', onInteractionStart, false);
            document.addEventListener('mousemove', onInteractionMove, false);
            document.addEventListener('mouseup', onInteractionEnd, false);
        }
}




