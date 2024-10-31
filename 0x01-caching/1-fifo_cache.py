#!/usr/bin/env python3
"""
FIFO Caching
"""
from base_caching import BaseCaching


class FIFOCache(BaseCaching):
    """
    a class FIFOCache that inherits from BaseCaching and is a caching system
    """
    def __init__(self):
        """
        Init method
        """
        super().__init__()
        self.key_indexes = []

    def put(self, key, item):
        """
        assign to the dictionary self.cache_data
        the item value for the key key.
        """
        if key and item:
            if key in self.cache_data:
                self.cache_data[key] = item
                return
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                discarded_key = self.key_indexes.pop(0)
                del self.cache_data[discarded_key]
                print("DISCARD:", discarded_key)

            self.cache_data[key] = item
            self.key_indexes.append(key)

    def get(self, key):
        """ Get an item by key """
        return self.cache_data.get(key, None)
