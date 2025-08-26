odoo.define('custom_crm_button.GroupByStageDropdown', function (require) {
    'use strict';

    const KanbanController = require('web.KanbanController');
    const viewRegistry = require('web.view_registry');
    const KanbanView = require('web.KanbanView');
    const rpc = require('web.rpc');

    const GroupByStageKanbanController = KanbanController.extend({
        renderButtons: function ($node) {
            this._super($node);
            if (this.$buttons) {
                const self = this;

                // Create dropdown button container
                const $dropdown = $(`
                    <div class="btn-group">
                      <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Group by Stage
                      </button>
                      <div class="dropdown-menu"></div>
                    </div>
                `);

                this.$buttons.append($dropdown);

                const $menu = $dropdown.find('.dropdown-menu');
                // Clear previous options (just in case)
                $menu.empty();

                // Fetch stage options dynamically via RPC
                rpc.query({
                    model: 'crm.stage',
                    method: 'search_read',
                    fields: ['id', 'name'],
                    domain: [],
                    order: 'sequence asc',
                }).then(function (stages) {
                    // Add an option to clear grouping/filter
                    $menu.append(`<a class="dropdown-item" href="#" data-stage-id="">Clear Grouping</a>`);

                    // Add stage options
                    stages.forEach(function (stage) {
                        $menu.append(`<a class="dropdown-item" href="#" data-stage-id="${stage.id}">${stage.name}</a>`);
                    });
                });

                // Handle dropdown item click
                $menu.on('click', 'a.dropdown-item', function (ev) {
                    ev.preventDefault();
                    const stageId = $(this).data('stage-id');

                    if (!stageId) {
                        // Clear grouping/filter: reset groupBy to empty
                        self.update({}, {groupBy: []});
                    } else {
                        // Group by stage_id filtered to selected stage
                        // We can either group by stage_id (all stages) or filter by stage_id (only selected)

                        // To group by stage_id only for selected stage, it's better to apply a filter:
                        self.update({domain: [['stage_id', '=', stageId]]}, {groupBy: ['stage_id']});
                    }
                });
            }
        },
    });

    const GroupByStageKanbanView = KanbanView.extend({
        config: _.extend({}, KanbanView.prototype.config, {
            Controller: GroupByStageKanbanController,
        }),
    });

    viewRegistry.add('kanban_stage_group_dropdown_view', GroupByStageKanbanView);
});
