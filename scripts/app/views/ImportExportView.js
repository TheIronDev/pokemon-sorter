define(['backbone'], function(Backbone){
    var ImportExportView = Backbone.View.extend({
        el: '.importExport-wrapper',
        initialize: function(options) {

        },
        subViews: {},
        events: {
            "click .exportField input": "export",
            "click .importField input": "import",
            "click .clearField input": "clear"
        },
        export: function(){
            var pokemonList = localStorage.pokedex ? localStorage.pokedex.split(',') : '',
                exportList = [];
            for (var index in pokemonList) {
                var currentPokemon = localStorage['pokedex-'+pokemonList[index]];
                if(currentPokemon) {
                    var parsedCurrentPokemon = JSON.parse(currentPokemon) || {};
                    if (parsedCurrentPokemon && parsedCurrentPokemon.caught) {
                        exportList.push(pokemonList[index]);
                    }
                }
            }
            exportList = exportList.join(',');
            this.$('#export').val(exportList.toString());
            this.$('#export').show();
            this.$('.messageDiv').text("Copy the export field and save it into a text file. When you are ready, paste the file into the import field.");
            this.$('.messageDiv').show();
        },
        import: function(){
            var importValue = this.$('#import').val(),
                pokemonList = importValue.split(',');
            localStorage.clear();
            localStorage.setItem('pokedex', importValue);
            for(var parsedParam in pokemonList){
                if (parsedParam) {
                    localStorage.setItem('pokedex-'+pokemonList[parsedParam], '{"caught":true}');
                }
            }
            this.$('.messageDiv').show();
            this.$('.messageDiv').text("Local Storage has been imported.");
            this.trigger('refreshPokemonList');
        },
        clear: function(){
            localStorage.clear();
            this.$('.messageDiv').show();
            this.$('.messageDiv').text("Local Storage has been cleared.");
            this.trigger('refreshPokemonList');
        }
    });

    return ImportExportView;
});