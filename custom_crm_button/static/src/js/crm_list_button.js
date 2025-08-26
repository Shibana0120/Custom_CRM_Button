odoo.define('custom_crm_button.MultiFilterButtons', function (require) {
    "use strict";

    const ListController = require('web.ListController');
    const ListView = require('web.ListView');
    const viewRegistry = require('web.view_registry');
    const rpc = require('web.rpc');

    const MultiFilterListController = ListController.extend({
        renderButtons: function () {
            this._super.apply(this, arguments);
            if (this.$buttons) {
                this._addDropdownButton('Customer', 'partner_id', 'customer-filter');
                this._addDropdownButton('Country', 'country_id', 'country-filter');
                this._addDropdownButton('Stage', 'stage_id', 'stage-filter');
            }
        },

        _addDropdownButton: function (title, field, css_class) {
            const $dropdown = $(`
                <div class="btn-group ml-2 ${css_class}">
                    <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                        ${title} Filter
                    </button>
                    <div class="dropdown-menu"></div>
                </div>
            `);

            $dropdown.find('button').on('click', () => {
                this._populateDropdown(field, $dropdown.find('.dropdown-menu'));
            });

            this.$buttons.append($dropdown);
        },

        _populateDropdown: function (field_name, $menu) {
            rpc.query({
                model: 'crm.lead',
                method: 'search_read',
                domain: [[field_name, '!=', false]],
                fields: [field_name],
            }).then(records => {
                const values = {};
                records.forEach(rec => {
                    if (rec[field_name] && rec[field_name].length) {
                        values[rec[field_name][1]] = true;
                    }
                });
                $menu.empty();
                Object.keys(values).sort().forEach(val => {
                    const $item = $(`<a class="dropdown-item" href="#">${val}</a>`);
                    $item.on('click', (e) => {
                        e.preventDefault();
                        this._applyFilter(field_name, val);
                    });
                    $menu.append($item);
                });
            });
        },

        _applyFilter: function (field_name, value_name) {
            this.reload({
                domain: [[`${field_name}.name`, '=', value_name]],
            });
        },

    });

    const MultiFilterListView = ListView.extend({
        config: _.extend({}, ListView.prototype.config, {
            Controller: MultiFilterListController,
        }),
    });

    viewRegistry.add('multi_filter_list_view', MultiFilterListView);
});
