/**
 * Created by hyr on 2017/2/27 0027.
 */
function MyAssetsLoader(loader,arr_assets)
{
    this.loader=loader;
    this.arr_assets=arr_assets;
}
MyAssetsLoader.prototype= {
    constructor: MyAssetsLoader,
    load: function () {
        loader.add(arr_assets)
    },
    on: function (loadProgressHandler) {
        loader.on("progress", loadProgressHandler)
    },
    setup: function (completeHandler) {
        loader.load(completeHandler);
    }
}
        function loadProgressHandler(loader, resource) {

            //Display the file `url` currently being loaded
            console.log("loading: " + resource.url);

            //If you gave your files names with the `add` method, you can access
            //them like this
            //console.log("loading: " + resource.name);

            //Display the precentage of files currently loaded
            console.log("progress: " + loader.progress + "%");
        }

        function setup() {
            console.log("setup");

            //Create the sprites
            var cat = new Sprite(resources["images/cat.png"].texture),
                blob = new Sprite(resources["images/blob.png"].texture),
                explorer = new Sprite(resources["images/explorer.png"].texture);

            //Add the sprites to the stage
            stage.addChild(cat);
            stage.addChild(blob);
            stage.addChild(explorer);

            //Position the sprites
            blob.position.set(82, 82);
            explorer.position.set(128, 128);

            //Render the stage
            renderer.render(stage);
        }
}
