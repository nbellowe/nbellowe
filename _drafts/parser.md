this is still a draft.

Write up about the following

```Scala
object ExprParser extends RegexpParsers {
	val Name = """[a-zA-Z](a-zA-Z0-9)*""" // Starts with varter, than varters and numbers
	val Type = name // Typing has same naming as Name.
    val Expr = ??? //matches expressions - 3,3+3,("hello" + "goodbye")

	def validSet = (
        "val" ~ Name ~ ":" ~ Type ~ "=" ~ Expr
		| "var" ~ Name ~ ":" ~ Type ~ "=" ~ Expr
		| "def" ~ Name ~ ":" ~ Type ~ "=" ~ Expr
	)
}

```
