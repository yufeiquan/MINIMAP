class SearchBar {
    constructor(callback) {
        this.template = `
                        <div class="search-bar-wrapper">
                            <i class="search-bar-menu-icon material-icons" style="font-size:24px">menu</i>
                            <input type="text" placeholder="Search mini map" class="input-text-bar" />
                            <div class="search-icon"></div>
                            <div class="search-bar-menu">
                                <div class="search-bar-menu-row">restaurant</div>
                                <div class="search-bar-menu-row">park</div>
                                <div class="search-bar-menu-row">coffee</div>
                                <div class="search-bar-menu-row">donut</div>
                            </div>
                            <div class="search-bar-menu-tooltip">Menu</div>
                        </div>
                        `
        this.callback = callback;
    }

    addTo($parent) {
        $parent.append(this.template);
        $('.search-bar-wrapper').on('keyup', _.bind(function(e) {
            if (e.keyCode == 13) {
                this.callback($('.input-text-bar')[0].value);
            }
        }, this));
        $('.search-bar-menu-icon').on('click', function(ev) {
            $('.search-bar-menu').toggleClass('visible');
        });

        $('.search-bar-menu-row').on('click', _.bind(function(ev) {
            $('.input-text-bar')[0].value = ev.currentTarget.textContent;
            this.callback(ev.currentTarget.textContent);
        }, this));
    }
}
