from odoo import models

class CrmLead(models.Model):
    _inherit = 'crm.lead'

    def action_mark_won(self):
        for lead in self:
            lead.write({'stage_id': self.env.ref('crm.stage_lead5').id})
