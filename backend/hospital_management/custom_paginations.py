from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination


class CustomPagination(PageNumberPagination):
    page_size_query_param = 'pageSize'
    page_query_param = 'pageNo'

    def get_page_number(self, request, paginator):
        try:
            page_number = int(request.query_params.get(self.page_query_param, 1))
        except (TypeError, ValueError):
            page_number = 1
        return page_number

    def paginate_queryset(self, queryset, request, view=None):
        self.page_size = request.query_params.get(self.page_size_query_param)

        if self.page_size == "":
            self.page_size = 10

        return super().paginate_queryset(queryset, request, view)

    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'total_pages': self.page.paginator.num_pages,
            'current_page_number': self.page.number,
            'page_size': int(self.page_size),
            'results': data
        })
