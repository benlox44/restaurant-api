#!/bin/bash

# Script de prueba de endpoints GraphQL

# Variables
GRAPHQL_URL="http://localhost:3000/graphql"

echo "=== Prueba de Menu Query ==="
curl -X POST $GRAPHQL_URL \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { menu { id name description price category } }"
  }'

echo -e "\n\n=== Prueba de Create Menu Item ==="
curl -X POST $GRAPHQL_URL \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { createMenuItem(name: \"Pasta\", description: \"Delicious\", price: 12.99, category: \"Main\") { id item { id name price } } }"
  }'

echo -e "\n\n=== Prueba de Orders Query ==="
curl -X POST $GRAPHQL_URL \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { orders { id total status items { name quantity price } } }"
  }'

echo -e "\n\nPruebas completadas!"
