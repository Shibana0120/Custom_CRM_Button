# -*- coding: utf-8 -*-
# from odoo import http


# class CustomCrmButton(http.Controller):
#     @http.route('/custom_crm_button/custom_crm_button/', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/custom_crm_button/custom_crm_button/objects/', auth='public')
#     def list(self, **kw):
#         return http.request.render('custom_crm_button.listing', {
#             'root': '/custom_crm_button/custom_crm_button',
#             'objects': http.request.env['custom_crm_button.custom_crm_button'].search([]),
#         })

#     @http.route('/custom_crm_button/custom_crm_button/objects/<model("custom_crm_button.custom_crm_button"):obj>/', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('custom_crm_button.object', {
#             'object': obj
#         })
