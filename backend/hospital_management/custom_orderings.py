from rest_framework.filters import OrderingFilter

class CustomOrderingFilter(OrderingFilter):
    def get_ordering(self, request, queryset, view):
        sort_column_param = 'sortColumn'
        sort_direction_param = 'sortDirection'

        sort_column = request.query_params.get(sort_column_param)
        sort_direction = request.query_params.get(sort_direction_param)

        if sort_direction is None:
            ordering = []
            ordering.append(sort_column)
            return ordering
        
        if sort_column and sort_direction:
            ordering = []
            if sort_direction.lower() == 'desc':
                ordering.append(f'-{sort_column}')
            else:
                ordering.append(sort_column)

            return ordering

        return super().get_ordering(request, queryset, view)
