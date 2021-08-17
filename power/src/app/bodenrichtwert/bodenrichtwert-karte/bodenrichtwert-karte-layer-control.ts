import { Map } from 'maplibre-gl';
import { environment } from '@env/environment';

export default class BodenrichtwertKarteLayerControl {
    private map: Map;
    private btn: HTMLButtonElement;
    private container: HTMLDivElement;

    private mapIndex = 0;
    private timesClicked = 0;

    /**
     * onAdd creates a button and icon html element and add these to the map
     * @param map Map
     * @returns a div container including a button and i element
     */
    onAdd(map: Map) {
        this.map = map;
        this.btn = document.createElement('button');
        this.btn.className = 'btn';
        this.btn.type = 'button';
        this.btn.title = 'Basemap wechseln - Standard';
        this.btn.onclick = () => {
            this.timesClicked++;
            this.mapIndex += 1;

            if (this.timesClicked % 2 === 0) {
                this.map.setStyle(environment.basemap);
                this.btn.title = 'Basemap wechseln - Standard';
            } else {
                this.mapIndex = this.mapIndex % environment.baviStyles.length;
                const style = environment.baviStyles[this.mapIndex];
                this.map.setStyle(style);
                const lastSlash = style.lastIndexOf('/');
                this.btn.title = 'Basemap wechseln - ' + style.substr(lastSlash + 1, style.length).replace('.json', '');
                this.mapIndex += 1;
            }
        };

        const icon = document.createElement('i');
        icon.className = 'bi bi-layers';
        this.btn.appendChild(icon);

        this.container = document.createElement('div');
        this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
        this.container.appendChild(this.btn);

        return this.container;
    }

    /**
     * onRemove removes the html container and the map
     */
    onRemove() {
        this.container.parentNode.removeChild(this.container);
        this.map = undefined;
    }
}
