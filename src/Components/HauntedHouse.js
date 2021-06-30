// Haunted House

import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {Clock} from "three";
import dat from 'dat.gui';

const HauntedHouse = () => {

    const canvas = document.querySelector('.webgl');

    const gui = new dat.GUI();
    gui.hide()

    //cursor position
    const cursor = {
        x: 0,
        y: 0
    };

    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    };

    window.addEventListener('mousemove', (event) => {
        cursor.x = event.clientX / sizes.width - 0.5;
        cursor.y = event.clientY / sizes.height - 0.5;
    });

    const scene = new THREE.Scene();

    // -> textures
    const textureLoader = new THREE.TextureLoader();

    const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
    const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
    const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
    const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
    const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
    const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
    const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

    const brickColorTexture = textureLoader.load('/textures/bricks/color.jpg');
    const brickAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg');
    const brickNormalTexture = textureLoader.load('/textures/bricks/normal.jpg');
    const brickRoughnessTexture =  textureLoader.load('/textures/bricks/roughness.jpg');

    const grassColorTexture = textureLoader.load('/textures/grass/color.jpg');
    const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg');
    const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg');
    const grassRoughnessTexture =  textureLoader.load('/textures/grass/roughness.jpg');

    grassColorTexture.wrapS = THREE.RepeatWrapping;
    grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
    grassNormalTexture.wrapS = THREE.RepeatWrapping;
    grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

    grassColorTexture.wrapT = THREE.RepeatWrapping;
    grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
    grassNormalTexture.wrapT = THREE.RepeatWrapping;
    grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

    grassColorTexture.repeat.set(8, 8)
    grassAmbientOcclusionTexture.repeat.set(8, 8)
    grassNormalTexture.repeat.set(8, 8)
    grassRoughnessTexture.repeat.set(8, 8)

    const house = new THREE.Group();
    scene.add(house);

    const walls = new THREE.Mesh(
        new THREE.BoxBufferGeometry(4, 2.5, 4),
        new THREE.MeshStandardMaterial({
            map: brickColorTexture,
            aoMap: brickAmbientOcclusionTexture,
            normalMap: brickNormalTexture,
            roughnessMap: brickRoughnessTexture
        })
    );
    walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2));

    walls.position.y = 2.25 / 2;
    house.add(walls);

    const roof = new THREE.Mesh(
        new THREE.ConeBufferGeometry(3.5, 1, 4),
        new THREE.MeshStandardMaterial({color: '#b35f45'})
    );
    roof.position.y = 2.5 + 0.4;
    roof.rotation.y = Math.PI * 0.25;
    house.add(roof)

    const floor = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(20, 20),
        new THREE.MeshStandardMaterial({
            map: grassColorTexture,
            aoMap: grassAmbientOcclusionTexture,
            normalMap: grassNormalTexture,
            roughnessMap: grassRoughnessTexture
        })
    );
    floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2));
    floor.rotation.x = -Math.PI * 0.5;
    floor.position.y = 0;
    scene.add(floor);

    const door = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(2.2, 2.2, 100, 100),
        new THREE.MeshStandardMaterial({
            map: doorColorTexture,
            transparent: true,
            alphaMap: doorAlphaTexture,
            aoMap: doorAmbientOcclusionTexture,
            displacementMap: doorHeightTexture,
            displacementScale: 0.1,
            normalMap: doorNormalTexture,
            metalnessMap: doorMetalnessTexture,
            roughnessMap: doorRoughnessTexture
        })
    );
    door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2));
    door.position.z = 2 + 0.00001;
    door.position.y = 1;
    house.add(door);

    const bushMaterial = new THREE.MeshStandardMaterial({color: '#89c854'});
    const  bushGeometry= new THREE.SphereBufferGeometry(1, 16, 16);

    const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush1.scale.set(0.5, 0.5, 0.5);
    bush1.position.set(0.8, 0.1,2.1);

    const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush2.scale.set(0.25, 0.25, 0.25);
    bush2.position.set(1.4, 0.1, 2.1);

    const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush3.scale.set(0.4, 0.4, 0.4);
    bush3.position.set(-0.8, 0.1, 2.1);

    const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush4.scale.set(0.15, 0.15, 0.15);
    bush4.position.set(-1, 0.05, 2.6);

    house.add(bush1, bush2, bush3, bush4);


    const graves = new THREE.Group();
    scene.add(graves);

    const graveMaterial = new THREE.MeshStandardMaterial({color: '#b2b6b1'});
    const  graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2);

    for(let i = 0; i < 50; i ++){
        const angle = Math.random() * Math.PI * 2;
        const radius = 3 + Math.random() * 6;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;

        const grave = new THREE.Mesh(graveGeometry, graveMaterial);
        grave.position.set(x, 0.3, z);
        grave.rotation.y = (Math.random() - 0.5) * 0.4;
        grave.rotation.z = (Math.random() - 0.5) * 0.4;
        graves.add(grave);
        grave.castShadow = true

    }

    // -> lights
    const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12);
    gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001).name('ambient Intensity')
    scene.add(ambientLight);

    const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12);
    gui.add(moonLight, 'intensity').min(0).max(1).step(0.001).name('directional Int')
    gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001).name('directional x')
    gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001).name('directional y')
    moonLight.position.set(4, 5, -2);
    scene.add(moonLight);

    const doorLight = new THREE.PointLight('#ff7d46', 1, 7);
    doorLight.position.set(0, 2.2, 2.7);
    house.add(doorLight);

    // -> ghosts
    const ghost1 = new THREE.PointLight('#ff00ff', 2, 3);
    const ghost2 = new THREE.PointLight('#00ffff', 2, 3);
    const ghost3 = new THREE.PointLight('#ffff00', 2, 3);

    scene.add(ghost1, ghost2, ghost3);

    // -> fog
    const fog = new THREE.Fog('#262837', 1, 15);
    scene.fog = fog;

    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
    camera.position.set(2, 3, 7);
    scene.add(camera);

    //handle screen resize
    window.addEventListener('resize', () => {
        //update sizes
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;

        //update camera
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix()

        //update renderer
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });


    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor('#262837');

    // -> shadows
    renderer.shadowMap.enabled = true;
    moonLight.castShadow = true;
    doorLight.castShadow = true;
    ghost1.castShadow = true;
    ghost2.castShadow = true;
    ghost3.castShadow = true;

    walls.castShadow = true;
    bush1.castShadow = true;
    bush2.castShadow = true;
    bush3.castShadow = true;
    bush4.castShadow = true;

    floor.receiveShadow = true;

    // -> optimise shadow quality
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    doorLight.shadow.mapSize.width = 256;
    doorLight.shadow.mapSize.height = 256;
    doorLight.shadow.camera.far = 7;

    ghost1.shadow.mapSize.width = 256;
    ghost1.shadow.mapSize.height = 256;
    ghost1.shadow.camera.far = 7;

    ghost2.shadow.mapSize.width = 256;
    ghost2.shadow.mapSize.height = 256;
    ghost2.shadow.camera.far = 7;

    ghost3.shadow.mapSize.width = 256;
    ghost3.shadow.mapSize.height = 256;
    ghost3.shadow.camera.far = 7;

    const clock = new Clock();

    const tick = () => {
        const elapsedTime = clock.getElapsedTime();

        // -> animate ghosts
        const ghost1Angle = elapsedTime * 0.5;
        ghost1.position.x = Math.cos(ghost1Angle) * 4;
        ghost1.position.z = Math.sin(ghost1Angle) * 4;
        ghost1.position.y = Math.sin(elapsedTime * 3);

        const ghost2Angle = - elapsedTime * 0.5;
        ghost2.position.x = Math.cos(ghost2Angle) * 5;
        ghost2.position.z = Math.sin(ghost2Angle) * 5;
        ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

        const ghost3Angle = - elapsedTime * 0.18;
        ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
        ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
        ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);;

        controls.update();
        renderer.render(scene, camera);
        window.requestAnimationFrame(tick);
    };

    tick();

    return (
        <>
        </>
    )
};

export default HauntedHouse;