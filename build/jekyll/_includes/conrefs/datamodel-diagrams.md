### Data model diagrams

The diagrams of the data model as a whole and of the primary tables are stored in [lucidchart.com](http://lucidchart.com). To edit a diagram, click the edit link in the diagram or just below it. Any changes are reflected on the documentation automatically. These diagrams are intended to provide conceptual information, not to cover every detail.

Relationships between tables use UML-style cardinality notation. For example, in a parent-child relationship, each child has a single parent, but a parent can have many children. Diagrams show this many-to-one relationship as "parent 1 — \* child". To keep the diagrams simple, the zeroes are implied; technically the parent-child relationship should be "parent 1 — 0..\* child", because the parent can have zero to many children.
