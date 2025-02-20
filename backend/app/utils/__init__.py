from fastapi.routing import APIRoute


def custom_generate_unique_id(route: APIRoute) -> str:
    """Generate a unique operation ID from route tags and name"""
    tag = route.tags[0] if route.tags else "default"
    return f"{tag}-{route.name}"
